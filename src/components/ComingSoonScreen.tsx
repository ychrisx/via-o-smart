import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandMark } from './BrandMark';
import { COLORS } from '../constants/theme';

export function ComingSoonScreen({
  title,
  icon,
  description,
}: {
  title: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  description: string;
}) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.header}>
        <BrandMark compact />
      </View>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons color={COLORS.red} name={icon} size={34} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Em desenvolvimento</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.red,
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 36,
  },
  iconCircle: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 36,
    elevation: 2,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
  title: {
    color: COLORS.text,
    fontSize: 23,
    fontWeight: '800',
    marginTop: 22,
  },
  description: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 9,
    textAlign: 'center',
  },
  badge: {
    backgroundColor: COLORS.goldLight,
    borderRadius: 15,
    marginTop: 18,
    paddingHorizontal: 13,
    paddingVertical: 7,
  },
  badgeText: {
    color: '#825A0B',
    fontSize: 11,
    fontWeight: '700',
  },
});
