import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';

export default function ChecklistsScreen() {
  return <SafeAreaView edges={['top']} style={{ backgroundColor: COLORS.background, flex: 1 }} />;
}
