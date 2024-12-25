import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthTokenService = {
  // Lưu token
  async saveToken(token) {
    if (!token) {
      console.warn('Token is undefined or null. Use removeToken instead.');
      return;
    }
    try {
      await AsyncStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  },

  // Lấy token
  async getToken() {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  // Xóa token
  async removeToken() {
    try {
      await AsyncStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  },

  // Base64 decode function
  base64UrlDecode(base64Url) {
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }
    return atob(base64); // Note: atob is native to the browser environment
  },

  // Decode token manually
  decodeTokenManually(token) {
    try {
      const [header, payload, signature] = token.split('.');
      if (!header || !payload || !signature) {
        throw new Error('Invalid JWT token structure.');
      }
      const decodedPayload = JSON.parse(this.base64UrlDecode(payload));
      return decodedPayload;
    } catch (error) {
      console.error('Error decoding token manually:', error);
      return null;
    }
  },
};

export default AuthTokenService;
