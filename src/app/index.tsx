import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandMark } from '../components/BrandMark';
import { DEMO_CREDENTIALS } from '../constants/demoCredentials';
import { COLORS } from '../constants/theme';

export default function LoginScreen() {
  const passwordInput = useRef<TextInput>(null);
  const [email, setEmail] = useState(DEMO_CREDENTIALS.email);
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');

  function handleLogin() {
    const validEmail = email.trim().toLowerCase() === DEMO_CREDENTIALS.email;
    if (!validEmail || password !== DEMO_CREDENTIALS.password) {
      setError('E-mail ou senha incorretos. Confira seus dados e tente novamente.');
      return;
    }

    setError('');
    router.replace('/(tabs)');
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          bounces={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.hero}>
            <BrandMark />
            <Text style={styles.heroTitle}>Sistema de Abastecimento</Text>
            <Text style={styles.heroCopy}>
              Acesso do abastecedor da garagem.
              {'\n'}Entre para acompanhar suas operações.
            </Text>
          </View>

          <View style={styles.formArea}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Entrar</Text>
              <Text style={styles.cardSubtitle}>Acesse sua conta Viação Smart</Text>

              <Text style={styles.label}>E-mail</Text>
              <View style={styles.inputWrap}>
                <Ionicons color={COLORS.muted} name="mail-outline" size={18} />
                <TextInput
                  accessibilityLabel="E-mail"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  keyboardType="email-address"
                  onChangeText={(value) => {
                    setEmail(value);
                    setError('');
                  }}
                  onSubmitEditing={() => passwordInput.current?.focus()}
                  placeholder="seuemail@empresa.com"
                  placeholderTextColor="#A0A0A0"
                  returnKeyType="next"
                  style={styles.input}
                  value={email}
                />
              </View>

              <Text style={styles.label}>Senha</Text>
              <View style={styles.inputWrap}>
                <Ionicons color={COLORS.muted} name="lock-closed-outline" size={18} />
                <TextInput
                  accessibilityLabel="Senha"
                  autoCapitalize="none"
                  autoComplete="current-password"
                  onChangeText={(value) => {
                    setPassword(value);
                    setError('');
                  }}
                  onSubmitEditing={handleLogin}
                  placeholder="Digite sua senha"
                  placeholderTextColor="#A0A0A0"
                  ref={passwordInput}
                  returnKeyType="done"
                  secureTextEntry={!passwordVisible}
                  style={styles.input}
                  value={password}
                />
                <Pressable
                  accessibilityLabel={passwordVisible ? 'Ocultar senha' : 'Mostrar senha'}
                  accessibilityRole="button"
                  hitSlop={8}
                  onPress={() => setPasswordVisible((visible) => !visible)}
                >
                  <Ionicons
                    color={COLORS.muted}
                    name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                    size={19}
                  />
                </Pressable>
              </View>

              {error ? (
                <Text accessibilityLiveRegion="polite" style={styles.error}>
                  {error}
                </Text>
              ) : null}

              <Pressable
                accessibilityRole="button"
                onPress={handleLogin}
                style={({ pressed }) => [styles.submitButton, pressed && styles.pressed]}
              >
                <Text style={styles.submitText}>Entrar</Text>
                <Ionicons color="#FFFFFF" name="arrow-forward" size={18} />
              </Pressable>

              <View style={styles.profileNotice}>
                <Ionicons color="#A66D00" name="information-circle-outline" size={18} />
                <Text style={styles.profileText}>
                  Acesso de demonstração para o perfil{' '}
                  <Text style={styles.profileBold}>Abastecedor</Text>.
                </Text>
              </View>
            </View>
            <Text style={styles.footerText}>Viação Smart · Operação com segurança</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.red,
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  hero: {
    backgroundColor: COLORS.red,
    justifyContent: 'center',
    minHeight: 280,
    paddingHorizontal: 28,
    paddingBottom: 48,
    paddingTop: 28,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '800',
    marginTop: 20,
  },
  heroCopy: {
    color: '#F9EDEE',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  formArea: {
    backgroundColor: COLORS.background,
    flexGrow: 1,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderColor: '#EEEEEE',
    borderRadius: 18,
    borderWidth: 1,
    elevation: 4,
    marginTop: -32,
    padding: 22,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 25,
    fontWeight: '800',
  },
  cardSubtitle: {
    color: COLORS.muted,
    fontSize: 13,
    marginBottom: 22,
    marginTop: 4,
  },
  label: {
    color: '#424242',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 7,
  },
  inputWrap: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#DDDDDD',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 50,
    paddingHorizontal: 13,
    marginBottom: 17,
  },
  input: {
    color: COLORS.text,
    flex: 1,
    fontSize: 14,
    minWidth: 0,
    paddingVertical: 11,
  },
  error: {
    color: COLORS.redDark,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 12,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: COLORS.red,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 8,
    height: 52,
    justifyContent: 'center',
    marginTop: 2,
  },
  pressed: {
    opacity: 0.82,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  profileNotice: {
    alignItems: 'center',
    backgroundColor: COLORS.goldLight,
    borderColor: '#F0D8A5',
    borderRadius: 9,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    marginTop: 15,
    paddingHorizontal: 11,
    paddingVertical: 10,
  },
  profileText: {
    color: '#77510D',
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
  },
  profileBold: {
    fontWeight: '800',
  },
  footerText: {
    color: '#888888',
    fontSize: 11,
    marginTop: 18,
    textAlign: 'center',
  },
});
