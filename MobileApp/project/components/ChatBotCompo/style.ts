import { Dimensions , StyleSheet} from "react-native";

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    chatContainer: {
      position: 'absolute',
      bottom: 150,
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
    botAvatarConnected: {
      width: 32,
      height: 32,
      backgroundColor: 'rgba(88, 255, 55, 0.84)',
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    botAvatarDisconnected: {
        width: 32,
        height: 32,
        backgroundColor: 'rgba(219, 67, 7, 0.89)',
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
      bottom: 80,
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

  export default styles;