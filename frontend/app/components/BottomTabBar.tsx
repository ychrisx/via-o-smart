import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Colors, FontSize, Spacing } from './colors';

export type TabId = 'home' | 'escala' | 'checklist' | 'contatos';

export interface TabItem {
  id: TabId;
  label: string;
  /** Ícone Unicode simples; substitua por um componente de ícone real se preferir */
  icon: string;
}

const DEFAULT_TABS: TabItem[] = [
  { id: 'home',      label: 'Início',     icon: '🏠' },
  { id: 'escala',    label: 'Escala',     icon: '📋' },
  { id: 'checklist', label: 'Checklist',  icon: '✅' },
  { id: 'contatos',  label: 'Contatos',   icon: '👤' },
];

interface BottomTabBarProps {
  activeTab: TabId;
  onTabPress: (id: TabId) => void;
  /** Sobrescreve as tabs padrão se necessário */
  tabs?: TabItem[];
}

/**
 * Barra de navegação inferior padrão do app Smart Viação.
 * Fundo branco, ícone + label, item ativo em vermelho.
 */
export function BottomTabBar({
  activeTab,
  onTabPress,
  tabs = DEFAULT_TABS,
}: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => onTabPress(tab.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tab.label}
          >
            <Text style={[styles.icon, isActive && styles.iconActive]}>
              {tab.icon}
            </Text>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
            {isActive && <View style={styles.activeLine} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: Platform.OS === 'ios' ? 20 : Spacing.sm,
    paddingTop: Spacing.sm,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  icon: {
    fontSize: 20,
  },
  iconActive: {
    // tint via opacity; ícones reais usariam tintColor
  },
  label: {
    fontSize: FontSize.xs,
    color: Colors.tabInactive,
  },
  labelActive: {
    color: Colors.tabActive,
    fontWeight: '600',
  },
  activeLine: {
    position: 'absolute',
    top: -Spacing.sm,
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.tabActive,
  },
});
