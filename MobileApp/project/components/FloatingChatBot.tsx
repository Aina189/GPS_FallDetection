import React, { useState, useRef, useEffect } from 'react';
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
// import Voice from '@react-native-voice/voice';
// import Tts from 'react-native-tts';

// Vous devrez installer react-native-vector-icons et importer les icônes
// import Icon from 'react-native-vector-icons/MaterialIcons';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const { width, height } = Dimensions.get('window');

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
  
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef<ScrollView>(null);

//   useEffect(() => {
//     // Configuration de la reconnaissance vocale
//     Voice.onSpeechStart = onSpeechStart;
//     Voice.onSpeechRecognized = onSpeechRecognized;
//     Voice.onSpeechEnd = onSpeechEnd;
//     Voice.onSpeechError = onSpeechError;
//     Voice.onSpeechResults = onSpeechResults;

//     // Configuration TTS
//     Tts.setDefaultLanguage('fr-FR');
//     Tts.setDefaultRate(0.5);

//     return () => {
//       Voice.destroy().then(Voice.removeAllListeners);
//     };
//   }, []);

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

//   const onSpeechStart = () => {
//     setIsListening(true);
//   };

//   const onSpeechRecognized = () => {
//     setIsListening(true);
//   };

//   const onSpeechEnd = () => {
//     setIsListening(false);
//     setIsRecording(false);
//   };

//   const onSpeechError = (error: any) => {
//     console.log('Erreur reconnaissance vocale:', error);
//     setIsListening(false);
//     setIsRecording(false);
//     Alert.alert('Erreur', 'Problème avec la reconnaissance vocale');
//   };

//   const onSpeechResults = (event: any) => {
//     if (event.value && event.value[0]) {
//       setInputValue(event.value[0]);
//     }
//   };

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
      addMessage(inputValue, 'user');
      
      // Simulation de réponse du bot
      setTimeout(() => {
        const botResponses = [
          'C\'est une excellente question !',
          'Je comprends votre demande. Laissez-moi vous aider.',
          'Merci pour votre message. Voici ma réponse.',
          'Intéressant ! Pouvez-vous me donner plus de détails ?',
          'Je suis là pour vous aider avec ça.'
        ];
        const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
        addMessage(randomResponse, 'bot');
      }, 1000);
      
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

//   const speakMessage = (text: string) => {
//     Tts.speak(text);
//   };

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
              <View style={styles.botAvatar}>
                <Text style={styles.botAvatarText}>🤖</Text>
              </View>
              <View>
                <Text style={styles.headerTitle}>Assistant IA</Text>
                <Text style={styles.headerSubtitle}>En ligne</Text>
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
                        //onPress={() => speakMessage(message.text)}
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

const styles = StyleSheet.create({
  chatContainer: {
    position: 'absolute',
    bottom: 90,
    right: 16,
    width: width - 32,
    maxWidth: 380,
    height: height * 0.6,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#667eea',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botAvatar: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  botAvatarText: {
    fontSize: 16,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  userMessageRow: {
    flexDirection: 'row-reverse',
  },
  botMessageRow: {
    flexDirection: 'row',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  userAvatar: {
    backgroundColor: '#3b82f6',
  },
  botAvatarMessage: {
    backgroundColor: '#8b5cf6',
  },
  avatarText: {
    fontSize: 16,
  },
  messageContent: {
    flex: 1,
    maxWidth: '75%',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 4,
  },
  userBubble: {
    backgroundColor: '#3b82f6',
    borderBottomRightRadius: 4,
    alignSelf: 'flex-end',
  },
  botBubble: {
    backgroundColor: '#f3f4f6',
    borderBottomLeftRadius: 4,
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#ffffff',
  },
  botMessageText: {
    color: '#1f2937',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  timestamp: {
    fontSize: 10,
    color: '#9ca3af',
  },
  speakButton: {
    padding: 4,
  },
  speakButtonText: {
    fontSize: 12,
  },
  inputContainer: {
    padding: 16,
    backgroundColor: '#f9fafb',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInputContainer: {
    flex: 1,
    position: 'relative',
    marginRight: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    paddingRight: 40,
    backgroundColor: '#ffffff',
    fontSize: 14,
    maxHeight: 80,
    height: 40,
  },
  micButton: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  micButtonActive: {
    backgroundColor: '#ef4444',
  },
  micButtonText: {
    fontSize: 16,
  },
  micButtonTextActive: {
    color: '#ffffff',
  },
  sendButton: {
    width: 40,
    height: 40,
    backgroundColor: '#667eea',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  recordingText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 8,
    textAlign: 'center',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    zIndex: 1000,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonClosed: {
    backgroundColor: '#667eea',
  },
  buttonOpen: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    fontSize: 24,
    color: '#ffffff',
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
});

export default FloatingChatButton;