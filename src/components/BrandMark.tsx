import { StyleSheet, Text, View } from 'react-native';

type BrandMarkProps = {
  compact?: boolean;
};

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <View
      accessibilityLabel="Viação Smart"
      accessible
      style={[styles.container, compact && styles.compact]}
    >
      <Text style={[styles.caption, compact && styles.compactCaption]}>VIAÇÃO</Text>
      <Text style={[styles.name, compact && styles.compactName]}>Smart</Text>
      <View style={[styles.accent, compact && styles.compactAccent]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    paddingBottom: 7,
    position: 'relative',
  },
  compact: {
    paddingBottom: 4,
  },
  caption: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginLeft: 5,
  },
  compactCaption: {
    fontSize: 6,
    letterSpacing: 1,
    marginLeft: 3,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 40,
    fontStyle: 'italic',
    fontWeight: '900',
    letterSpacing: -2,
    lineHeight: 43,
  },
  compactName: {
    fontSize: 25,
    letterSpacing: -1.5,
    lineHeight: 27,
  },
  accent: {
    backgroundColor: '#E0A126',
    borderRadius: 2,
    bottom: 1,
    height: 3,
    left: 1,
    position: 'absolute',
    transform: [{ rotate: '-9deg' }],
    width: 89,
  },
  compactAccent: {
    bottom: 0,
    height: 2,
    width: 57,
  },
});
