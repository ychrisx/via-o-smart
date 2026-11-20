import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { Colors, FontSize, Spacing } from './colors';

interface HeaderProps {
  title: string;
  /** Exibe a seta de voltar */
  showBack?: boolean;
  /** Callback ao pressionar voltar */
  onBack?: () => void;
  /** Ícone no lado direito (componente React) */
  rightIcon?: React.ReactNode;
  /** Callback ao pressionar o ícone direito */
  onRightPress?: () => void;
}

/**
 * Header padrão do app Smart Viação.
 * Fundo vermelho, título centralizado, seta de voltar opcional
 * e slot para ícone à direita (sino, perfil, etc).
 */
export function Header({
  title,
  showBack = false,
  onBack,
  rightIcon,
  onRightPress,
}: HeaderProps) {
  return (
    <>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
      <View style={styles.container}>
        {/* Lado esquerdo — botão de voltar ou espaço vazio */}
        <View style={styles.side}>
          {showBack && (
            <TouchableOpacity
              onPress={onBack}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
            >
              <Text style={styles.backArrow}>{'←'}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Título centralizado */}
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        {/* Lado direito — ícone opcional */}
        <View style={[styles.side, styles.sideRight]}>
          {rightIcon && (
            <TouchableOpacity
              onPress={onRightPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel="Ação do header"
            >
              {rightIcon}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
}

const HEADER_HEIGHT = 56;

const styles = StyleSheet.create({
  container: {
    height: HEADER_HEIGHT,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    // Sombra sutil embaixo do header
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  side: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  backArrow: {
    color: Colors.white,
    fontSize: FontSize.xl,
    lineHeight: FontSize.xl + 4,
  },
  title: {
    flex: 1,
    color: Colors.white,
    fontSize: FontSize.lg,
    fontWeight: '700',
    textAlign: 'center',
  },
});
