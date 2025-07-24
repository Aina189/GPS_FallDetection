import { useState, useRef, useEffect, use } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { Mic } from 'lucide-react-native';
import styles from './style';
// import Voice from '@react-native-voice/voice';
//import Tts from 'react-native-tts';
import React = require('react');

// Vous devrez installer react-native-vector-icons et importer les icônes
// import Icon from 'react-native-vector-icons/MaterialIcons';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}


const FloatingChatButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const ws = useRef<WebSocket | null>(null);

  // useEffect(() => {
  //   // Configuration de la reconnaissance vocale
    
  //   Voice.onSpeechStart = onSpeechStart;
  //   Voice.onSpeechRecognized = onSpeechRecognized;
  //   Voice.onSpeechEnd = onSpeechEnd;
  //   Voice.onSpeechError = onSpeechError;
  //   Voice.onSpeechResults = onSpeechResults;

  //   // Configuration TTS
  //   Tts.setDefaultLanguage('fr-FR');
  //   Tts.setDefaultRate(0.5);

  //   return () => {
  //     Voice.destroy().then(Voice.removeAllListeners);
  //   };
  // }, []);

  useEffect(() => {
    if (isOpen) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    }
  }, [isOpen]);

  useEffect(() => {
    // Auto-scroll vers le bas quand de nouveaux messages arrivent
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  useEffect(() => {
    ws.current = new WebSocket('ws://192.168.0.118:8080/ws?role=user');

    ws.current.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    ws.current.onmessage = (e) => {
      try {
        const data = e.data;
        //console.log('Message reçu:', e.data);
        addMessage(data, 'bot');
        // if (data.type === 'message') {
        //   addMessage(data.content, 'bot');
        // }
      } catch (err) {
        console.error('Erreur JSON:', err);
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      Alert.alert('Erreur', 'Connexion WebSocket échouée');
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    return () => {
      ws.current?.close();
    };
  }, []);
  
    

  // const onSpeechStart = () => {
  //   setIsListening(true);
  // };

  // const onSpeechRecognized = () => {
  //   setIsListening(true);
  // };

  // const onSpeechEnd = () => {
  //   setIsListening(false);
  //   setIsRecording(false);
  // };

  // const onSpeechError = (error: any) => {
  //   console.log('Erreur reconnaissance vocale:', error);
  //   setIsListening(false);
  //   setIsRecording(false);
  //   Alert.alert('Erreur', 'Problème avec la reconnaissance vocale');
  // };

  // const onSpeechResults = (event: any) => {
  //   if (event.value && event.value[0]) {
  //     setInputValue(event.value[0]);
  //   }
  // };

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      addMessage(inputValue.trim(), 'user');
      ws.current?.send(inputValue);
      setInputValue('');
    }
  };

//   const startRecording = async () => {
//     try {
//       setIsRecording(true);
//       await Voice.start('fr-FR');
//     } catch (error) {
//       console.log('Erreur démarrage reconnaissance:', error);
//       setIsRecording(false);
//     }
//   };

//   const stopRecording = async () => {
//     try {
//       await Voice.stop();
//       setIsRecording(false);
//     } catch (error) {
//       console.log('Erreur arrêt reconnaissance:', error);
//     }
//   };

  // const speakMessage = (text: string) => {
  //   Tts.speak(text);
  // };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleButtonPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    setIsOpen(!isOpen);
  };

  const chatTransform = {
    transform: [
      {
        translateY: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [500, 0],
        }),
      },
      {
        scale: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1],
        }),
      },
    ],
    opacity: slideAnim,
  };

  return (
    <>
      {/* Fenêtre de Chat */}
      {isOpen && (
        <Animated.View style={[styles.chatContainer, chatTransform]}>
          {/* En-tête */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={isConnected?styles.botAvatarConnected:styles.botAvatarDisconnected}>
                <Text style={styles.botAvatarText}>🤖</Text>
              </View>
              <View>
                <Text style={styles.headerTitle}>Assistant IA</Text>
                <Text style={styles.headerSubtitle}>{isConnected?"En ligne":"Deconnecter"}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setIsOpen(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageRow,
                  message.sender === 'user' ? styles.userMessageRow : styles.botMessageRow
                ]}
              >
                <View style={[
                  styles.avatar,
                  message.sender === 'user' ? styles.userAvatar : styles.botAvatarMessage
                ]}>
                  <Text style={styles.avatarText}>
                    {message.sender === 'user' ? '👤' : '🤖'}
                  </Text>
                </View>
                <View style={styles.messageContent}>
                  <View style={[
                    styles.messageBubble,
                    message.sender === 'user' ? styles.userBubble : styles.botBubble
                  ]}>
                    <Text style={[
                      styles.messageText,
                      message.sender === 'user' ? styles.userMessageText : styles.botMessageText
                    ]}>
                      {message.text}
                    </Text>
                  </View>
                  <View style={styles.messageFooter}>
                    <Text style={styles.timestamp}>
                      {formatTime(message.timestamp)}
                    </Text>
                    {message.sender === 'bot' && (
                      <TouchableOpacity
                        // onPress={() => speakMessage(message.text)}
                        style={styles.speakButton}
                      >
                        <Text style={styles.speakButtonText}>🔊</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Zone de saisie */}
          <View style={styles.inputContainer}>
            <View style={styles.inputRow}>
              <View style={styles.textInputContainer}>
                <TextInput
                  value={inputValue}
                  onChangeText={setInputValue}
                  placeholder="Tapez votre message..."
                  style={styles.textInput}
                  multiline
                  maxLength={500}
                />
                <TouchableOpacity
                  //onPress={isRecording ? stopRecording : startRecording}
                  style={[
                    styles.micButton,
                    isRecording && styles.micButtonActive
                  ]}
                >
                  <Text style={[
                    styles.micButtonText,
                    isRecording && styles.micButtonTextActive
                  ]}>
                    {isRecording ? '🔴' : <Mic/>}
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={handleSendMessage}
                disabled={!inputValue.trim()}
                style={[
                  styles.sendButton,
                  !inputValue.trim() && styles.sendButtonDisabled
                ]}
              >
                <Text style={styles.sendButtonText}>➤</Text>
              </TouchableOpacity>
            </View>
            {isRecording && (
              <Text style={styles.recordingText}>
                🔴 Enregistrement en cours... Parlez maintenant
              </Text>
            )}
          </View>
        </Animated.View>
      )}

      {/* Bouton Flottant */}
      <Animated.View style={[styles.floatingButton, { transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity
          onPress={handleButtonPress}
          style={[
            styles.button,
            isOpen ? styles.buttonOpen : styles.buttonClosed
          ]}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {isOpen ? '✕' : '💬'}
          </Text>
          {!isOpen && <View style={styles.notificationDot} />}
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};



export default FloatingChatButton;