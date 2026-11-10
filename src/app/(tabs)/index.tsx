import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandMark } from '../../components/BrandMark';
import { COLORS } from '../../constants/theme';

const today = new Date();
const monthDayCount = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
const monthName = today.toLocaleDateString('pt-BR', { month: 'long' });
const abbreviatedMonth = today
  .toLocaleDateString('pt-BR', { month: 'short' })
  .replace('.', '');
const WORK_DAYS = Array.from({ length: monthDayCount }, (_, index) => {
  const date = new Date(today.getFullYear(), today.getMonth(), index + 1);
  const isWorkDay = date.getDay() !== 0 && date.getDay() !== 6;
  const isHoliday = index === 7 || index === 21;
  return {
    color: isHoliday ? COLORS.gold : isWorkDay ? COLORS.red : '#BFC5C7',
    height: isHoliday ? 44 : isWorkDay ? 24 + ((index * 11) % 18) : 14,
  };
});

export default function HomeScreen() {
  const formattedDate = today.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const daysUntilSaturday = (6 - today.getDay() + 7) % 7 || 7;
  const nextSaturday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + daysUntilSaturday,
  );
  const formattedCalloutDate = nextSaturday
    .toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
    })
    .replace('.', '')
    .replace(/^./, (letter) => letter.toLocaleUpperCase());

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.header}>
        <BrandMark compact />
        <Pressable
          accessibilityLabel="Notificações"
          accessibilityRole="button"
          onPress={() => Alert.alert('Notificações', 'Você não tem notificações novas.')}
          style={styles.notificationButton}
        >
          <Ionicons color={COLORS.gold} name="notifications" size={22} />
          <View style={styles.notificationDot} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.greeting}>
          <View>
            <Text style={styles.greetingTitle}>Olá, Christian</Text>
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>
          <View style={styles.avatar}>
            <Ionicons color="#9EA2A3" name="person" size={19} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Próxima escala</Text>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderTitle}>
              Hoje, {today.getDate()} {abbreviatedMonth}.
            </Text>
            <Text style={styles.statusBadge}>Confirmada</Text>
          </View>
          <View style={styles.tripDetails}>
            <View style={styles.detailColumn}>
              <Text style={styles.detailLabel}>Horário de Partida</Text>
              <View style={styles.detailValueRow}>
                <View style={styles.iconTile}>
                  <Ionicons color="#2B2B2B" name="time-outline" size={19} />
                </View>
                <Text style={styles.timeText}>14:40</Text>
              </View>
            </View>
            <View style={styles.detailColumn}>
              <Text style={styles.detailLabel}>Veículo</Text>
              <View style={styles.detailValueRow}>
                <View style={styles.iconTile}>
                  <Ionicons color="#2B2B2B" name="bus-outline" size={19} />
                </View>
                <View>
                  <Text style={styles.busName}>Ônibus 204</Text>
                  <Text style={styles.busPlate}>FRT-2J48</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.timeline}>
            <View style={styles.timelineLine} />
            <View style={styles.timelineRow}>
              <View style={styles.timelineDot} />
              <View>
                <Text style={styles.timelineLabel}>SAÍDA · 15:00</Text>
                <Text style={styles.timelinePlace}>São Paulo · Barra Funda</Text>
              </View>
            </View>
            <View style={styles.timelineRow}>
              <View style={[styles.timelineDot, styles.timelineDotFilled]} />
              <View>
                <Text style={styles.timelineLabel}>DESTINO · RETORNO ATÉ 19:00</Text>
                <Text style={styles.timelinePlace}>Cajamar · Centro logístico</Text>
              </View>
            </View>
          </View>
          <Text style={styles.tripFootnote}>Escala confirmada. Aguardando início da operação.</Text>
        </View>

        <ActionButton
          label="Ver detalhes da escala"
          onPress={() => router.push('/(tabs)/scales')}
        />

        <Text style={styles.sectionTitle}>Convocações extras</Text>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderTitle}>{formattedCalloutDate}</Text>
          </View>
          <View style={styles.callout}>
            <View style={styles.smallIconTile}>
              <Ionicons color="#383838" name="briefcase-outline" size={18} />
            </View>
            <View style={styles.calloutCopy}>
              <Text style={styles.calloutTitle}>Traslado · Aeroporto GRU</Text>
              <Text style={styles.calloutDetail}>08:00–14:00</Text>
            </View>
          </View>
        </View>
        <ActionButton
          label="Analisar convocação"
          onPress={() =>
            Alert.alert('Convocação extra', 'Os detalhes desta convocação estarão disponíveis em breve.')
          }
        />

        <Text style={styles.sectionTitle}>Horas trabalhadas</Text>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderTitle}>
              {monthName.charAt(0).toLocaleUpperCase() + monthName.slice(1)} de {today.getFullYear()}
            </Text>
          </View>
          <View style={styles.hoursContent}>
            <View style={styles.hoursHeading}>
              <Text style={styles.hoursTotal}>176h</Text>
              <Text style={styles.hoursCaption}>trabalhadas no mês</Text>
            </View>
            <View accessibilityLabel="Gráfico de horas trabalhadas em novembro" style={styles.chart}>
              {WORK_DAYS.map((day, index) => (
                <View key={index} style={styles.chartTrack}>
                  <View
                    style={[
                      styles.chartBar,
                      { backgroundColor: day.color, height: day.height },
                    ]}
                  />
                </View>
              ))}
            </View>
            <View style={styles.chartLabels}>
              <Text style={styles.chartLabel}>01</Text>
              <Text style={styles.chartLabel}>05</Text>
              <Text style={styles.chartLabel}>10</Text>
              <Text style={styles.chartLabel}>15</Text>
              <Text style={styles.chartLabel}>20</Text>
              <Text style={styles.chartLabel}>25</Text>
              <Text style={styles.chartLabel}>{monthDayCount}</Text>
            </View>
            <View style={styles.legend}>
              <Legend color={COLORS.red} label="176h trabalho" />
              <Legend color="#BFC5C7" label="352h descanso" />
              <Legend color={COLORS.gold} label="8 folgas" />
            </View>
          </View>
        </View>
        <ActionButton
          label="Solicitar folga"
          icon="calendar-outline"
          onPress={() =>
            Alert.alert('Solicitação de folga', 'A solicitação de folga estará disponível em breve.')
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function ActionButton({
  label,
  icon = 'arrow-forward',
  onPress,
}: {
  label: string;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
    >
      <Text style={styles.actionButtonText}>{label}</Text>
      <Ionicons color="#222222" name={icon} size={17} />
    </Pressable>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  header: {
    alignItems: 'center',
    backgroundColor: COLORS.red,
    flexDirection: 'row',
    height: 56,
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  notificationButton: {
    alignItems: 'center',
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  notificationDot: {
    backgroundColor: '#F5CF56',
    borderColor: COLORS.red,
    borderRadius: 4,
    borderWidth: 1,
    height: 8,
    position: 'absolute',
    right: 7,
    top: 6,
    width: 8,
  },
  content: {
    paddingBottom: 18,
    paddingHorizontal: 14,
    paddingTop: 13,
  },
  greeting: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  greetingTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '500',
  },
  dateText: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 3,
    textTransform: 'capitalize',
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#E7E8E8',
    borderRadius: 18,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 7,
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    elevation: 2,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardHeader: {
    alignItems: 'center',
    backgroundColor: COLORS.red,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 35,
    paddingHorizontal: 13,
  },
  cardHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  statusBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    color: COLORS.red,
    fontSize: 9,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tripDetails: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  detailColumn: {
    flex: 1,
  },
  detailLabel: {
    color: COLORS.red,
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 5,
  },
  detailValueRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  iconTile: {
    alignItems: 'center',
    backgroundColor: COLORS.gold,
    borderRadius: 7,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  timeText: {
    color: COLORS.text,
    fontSize: 27,
    fontWeight: '400',
    letterSpacing: -1,
  },
  busName: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: '700',
  },
  busPlate: {
    color: COLORS.text,
    fontSize: 9,
    marginTop: 2,
  },
  timeline: {
    marginHorizontal: 16,
    marginTop: 13,
    paddingBottom: 2,
    paddingLeft: 15,
  },
  timelineLine: {
    backgroundColor: COLORS.red,
    bottom: 16,
    left: 3,
    position: 'absolute',
    top: 7,
    width: 1,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 9,
    marginBottom: 8,
  },
  timelineDot: {
    backgroundColor: '#FFFFFF',
    borderColor: COLORS.red,
    borderRadius: 5,
    borderWidth: 1.5,
    height: 8,
    marginLeft: -15,
    marginTop: 3,
    width: 8,
  },
  timelineDotFilled: {
    backgroundColor: COLORS.red,
  },
  timelineLabel: {
    color: COLORS.muted,
    fontSize: 8,
  },
  timelinePlace: {
    color: '#353535',
    fontSize: 11,
    marginTop: 2,
  },
  tripFootnote: {
    borderTopColor: '#EEEEEE',
    borderTopWidth: 1,
    color: COLORS.muted,
    fontSize: 9,
    marginHorizontal: 14,
    paddingBottom: 10,
    paddingTop: 8,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: COLORS.gold,
    borderRadius: 10,
    elevation: 2,
    flexDirection: 'row',
    gap: 8,
    height: 43,
    justifyContent: 'center',
    marginBottom: 11,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  pressed: {
    opacity: 0.8,
  },
  actionButtonText: {
    color: '#202020',
    fontSize: 12,
    fontWeight: '600',
  },
  callout: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 11,
    minHeight: 58,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  smallIconTile: {
    alignItems: 'center',
    backgroundColor: '#F2B842',
    borderRadius: 7,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  calloutCopy: {
    flex: 1,
  },
  calloutTitle: {
    color: '#424242',
    fontSize: 11,
  },
  calloutDetail: {
    color: COLORS.muted,
    fontSize: 9,
    marginTop: 4,
  },
  hoursContent: {
    paddingHorizontal: 13,
    paddingVertical: 12,
  },
  hoursHeading: {
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: 7,
    marginBottom: 9,
  },
  hoursTotal: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: '500',
  },
  hoursCaption: {
    color: '#555555',
    fontSize: 10,
  },
  chart: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 2,
    height: 52,
  },
  chartTrack: {
    backgroundColor: '#E7E9E9',
    borderRadius: 2,
    flex: 1,
    height: 50,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  chartBar: {
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    width: '100%',
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 3,
  },
  chartLabel: {
    color: COLORS.muted,
    fontSize: 8,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
    marginTop: 12,
  },
  legendItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  legendDot: {
    borderRadius: 3,
    height: 6,
    width: 6,
  },
  legendText: {
    color: COLORS.muted,
    fontSize: 8,
  },
});
