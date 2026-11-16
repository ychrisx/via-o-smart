import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';

const DEPARTURE_TIME = '14:40';
const RETURN_TIME = '19:00';
const INITIAL_ODOMETER = '148.320';

function formatTime(date: Date) {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function formatScaleDate(date: Date) {
  const formatted = date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return formatted.charAt(0).toLocaleUpperCase() + formatted.slice(1);
}

function isValidOdometer(value: string) {
  return /^\d{1,3}(?:[.]?\d{3})*(?:,\d{1,2})?$/.test(value.trim());
}

function isValidTime(value: string) {
  return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value.trim());
}

function SectionTitle({ children }: { children: string }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function ScaleInput({
  label,
  value,
  placeholder,
  keyboardType,
  unit,
  onChangeText,
}: {
  label: string;
  value: string;
  placeholder: string;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
  unit?: string;
  onChangeText: (value: string) => void;
}) {
  return (
    <View style={styles.inputColumn}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          accessibilityLabel={label}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#A2A2A2"
          style={styles.input}
          value={value}
        />
        {unit ? <Text style={styles.inputUnit}>{unit}</Text> : null}
      </View>
    </View>
  );
}

function ActionButton({
  label,
  icon,
  disabled = false,
  onPress,
}: {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        disabled && styles.actionButtonDisabled,
        pressed && !disabled && styles.actionButtonPressed,
      ]}
    >
      <Text style={[styles.actionButtonText, disabled && styles.actionButtonTextDisabled]}>
        {label}
      </Text>
      <Ionicons
        color={disabled ? '#777777' : '#252525'}
        name={icon}
        size={16}
      />
    </Pressable>
  );
}

export default function ScalesScreen() {
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [deliveryChecklistDone, setDeliveryChecklistDone] = useState(false);
  const [finalized, setFinalized] = useState(false);
  const [saved, setSaved] = useState(false);
  const [actualStartTime, setActualStartTime] = useState('');
  const [actualEndTime, setActualEndTime] = useState('');
  const [initialOdometer, setInitialOdometer] = useState(INITIAL_ODOMETER);
  const [finalOdometer, setFinalOdometer] = useState('');

  const today = new Date();
  const abbreviatedMonth = today
    .toLocaleDateString('pt-BR', { month: 'short' })
    .replace('.', '');
  const canFinalize = ended && deliveryChecklistDone && !finalized;

  const startOperation = () => {
    if (!isValidOdometer(initialOdometer)) {
      Alert.alert('Quilometragem inválida', 'Informe a quilometragem inicial do ônibus.');
      return;
    }
    if (actualStartTime && !isValidTime(actualStartTime)) {
      Alert.alert('Horário inválido', 'Informe o início realizado no formato HH:MM.');
      return;
    }

    setActualStartTime((value) => value || formatTime(new Date()));
    setStarted(true);
    setSaved(false);
  };

  const saveRecord = () => {
    if (!isValidOdometer(initialOdometer)) {
      Alert.alert('Quilometragem inválida', 'Confira a quilometragem inicial informada.');
      return;
    }
    if (finalOdometer && !isValidOdometer(finalOdometer)) {
      Alert.alert('Quilometragem inválida', 'Confira a quilometragem final informada.');
      return;
    }
    if (actualStartTime && !isValidTime(actualStartTime)) {
      Alert.alert('Horário inválido', 'Confira o início realizado no formato HH:MM.');
      return;
    }
    if (actualEndTime && !isValidTime(actualEndTime)) {
      Alert.alert('Horário inválido', 'Confira o término realizado no formato HH:MM.');
      return;
    }

    setSaved(true);
    Alert.alert('Registro salvo', 'Os dados foram salvos como rascunho nesta sessão.');
  };

  const endOperation = () => {
    if (!isValidTime(actualEndTime)) {
      Alert.alert('Horário pendente', 'Informe o horário de término realizado.');
      return;
    }
    if (!isValidOdometer(finalOdometer)) {
      Alert.alert('Quilometragem pendente', 'Informe a quilometragem final do ônibus.');
      return;
    }

    setEnded(true);
    setSaved(false);
  };

  const openDeliveryChecklist = () => {
    Alert.alert(
      'Checklist de Entrega',
      'Confirme que a inspeção de entrega do veículo foi realizada.',
      [
        { text: 'Voltar', style: 'cancel' },
        {
          text: 'Concluir checklist',
          onPress: () => setDeliveryChecklistDone(true),
        },
      ],
    );
  };

  const finalizeScale = () => {
    if (!canFinalize) return;
    setFinalized(true);
    Alert.alert('Escala finalizada', 'O registro da operação foi concluído.');
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Voltar"
          accessibilityRole="button"
          hitSlop={10}
          onPress={() => {
            if (router.canGoBack()) router.back();
            else router.replace('/(tabs)');
          }}
          style={styles.backButton}
        >
          <Ionicons color={COLORS.text} name="arrow-back" size={18} />
        </Pressable>
        <View style={styles.headerCopy}>
          <Text style={styles.headerTitle}>Detalhes da escala</Text>
          <Text style={styles.headerDate}>{formatScaleDate(today)}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.scaleCard}>
          <View style={styles.scaleCardHeader}>
            <Text style={styles.cardHeaderTitle}>
              Hoje, {today.getDate()} {abbreviatedMonth}.
            </Text>
            <Text style={styles.statusBadge}>
              {finalized ? 'Finalizada' : ended ? 'Encerrada' : started ? 'Em andamento' : 'Não iniciada'}
            </Text>
          </View>
          <View style={styles.tripDetails}>
            <View style={styles.detailColumn}>
              <Text style={styles.detailLabel}>Horário de Partida</Text>
              <View style={styles.detailValueRow}>
                <View style={styles.iconTile}>
                  <Ionicons color="#2B2B2B" name="time-outline" size={19} />
                </View>
                <Text style={styles.timeText}>{DEPARTURE_TIME}</Text>
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
          <Text style={styles.tripFootnote}>
            {started
              ? 'Operação iniciada. Registre os dados realizados ao longo da escala.'
              : 'Escala confirmada. Aguardando início da operação.'}
          </Text>
        </View>

        <SectionTitle>Registro da operação</SectionTitle>
        <View style={styles.formCard}>
          <View style={styles.cardSectionHeader}>
            <Text style={styles.cardHeaderTitle}>Horários e quilometragem</Text>
          </View>
          <View style={styles.formContent}>
            <Text style={styles.cardDescription}>
              Horários de {today.toLocaleDateString('pt-BR')}, no formato 24h. Preencha os dados antes de iniciar.
            </Text>
            <Text style={styles.formSectionTitle}>Horários programados</Text>
            <View style={styles.scheduledTimes}>
              <View style={styles.scheduledTime}>
                <Text style={styles.inputLabel}>Início</Text>
                <Text style={styles.scheduledTimeValue}>{DEPARTURE_TIME}</Text>
              </View>
              <View style={styles.scheduledTime}>
                <Text style={styles.inputLabel}>Término</Text>
                <Text style={styles.scheduledTimeValue}>{RETURN_TIME}</Text>
              </View>
            </View>

            <Text style={[styles.formSectionTitle, styles.secondFormSection]}>
              Horários realizados
            </Text>
            <View style={styles.inputRow}>
              <ScaleInput
                label="Início realizado"
                onChangeText={(value) => {
                  setActualStartTime(value);
                  setSaved(false);
                }}
                placeholder="--:--"
                value={actualStartTime}
              />
              <ScaleInput
                label="Término realizado"
                onChangeText={(value) => {
                  setActualEndTime(value);
                  setSaved(false);
                }}
                placeholder="--:--"
                value={actualEndTime}
              />
            </View>
            <Text style={styles.helperText}>
              {started
                ? 'O início foi registrado. Informe o término ao encerrar a operação.'
                : 'Ainda não registrado. O início será registrado ao tocar em Iniciar Operação.'}
            </Text>

            <Text style={[styles.formSectionTitle, styles.secondFormSection]}>
              Quilometragem do ônibus
            </Text>
            <View style={styles.inputRow}>
              <ScaleInput
                keyboardType="decimal-pad"
                label="Quilometragem inicial"
                onChangeText={(value) => {
                  setInitialOdometer(value);
                  setSaved(false);
                }}
                placeholder="0"
                unit="km"
                value={initialOdometer}
              />
              <ScaleInput
                keyboardType="decimal-pad"
                label="Quilometragem final"
                onChangeText={(value) => {
                  setFinalOdometer(value);
                  setSaved(false);
                }}
                placeholder="—"
                unit="km"
                value={finalOdometer}
              />
            </View>
            <Text style={styles.helperText}>
              Inicial preenchido para conferência. Informe o odômetro final no encerramento.
            </Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/(tabs)/checklists')}
          style={({ pressed }) => [styles.checklistCard, pressed && styles.cardPressed]}
        >
          <View style={styles.checklistIcon}>
            <Ionicons color={COLORS.red} name="checkbox-outline" size={17} />
          </View>
          <View style={styles.checklistCopy}>
            <Text style={styles.checklistTitle}>Checklist de Saída</Text>
            <Text style={styles.checklistDone}>Concluído · Ver checklist</Text>
          </View>
          <Ionicons color={COLORS.muted} name="chevron-forward" size={17} />
          <Text style={styles.checklistDescription}>
            Inspeção obrigatória antes do início concluída. Confira o km inicial e inicie a operação.
          </Text>
        </Pressable>

        {started && !ended ? (
          <ActionButton
            icon="flag-outline"
            label="Encerrar Operação"
            onPress={endOperation}
          />
        ) : null}
        {!started ? (
          <ActionButton
            icon="play-outline"
            label="Iniciar Operação"
            onPress={startOperation}
          />
        ) : null}
        {!finalized ? (
          <ActionButton
            icon="save-outline"
            label="Salvar Registro"
            onPress={saveRecord}
          />
        ) : null}
        <Text style={styles.actionHelper}>
          {saved
            ? 'Rascunho salvo nesta sessão.'
            : 'Salvar mantém os dados em rascunho, sem iniciar a operação.'}
        </Text>

        <View style={styles.autonomyCard}>
          <View style={styles.cardSectionHeader}>
            <Text style={styles.cardHeaderTitle}>Autonomia estimada</Text>
          </View>
          <View style={styles.autonomyContent}>
            <View style={styles.autonomySummary}>
              <View style={styles.iconTile}>
                <Ionicons color="#2B2B2B" name="bus-outline" size={17} />
              </View>
              <Text style={styles.autonomyValue}>280</Text>
              <Text style={styles.autonomyUnit}>km estimados</Text>
            </View>
            <Text style={styles.cardDescription}>
              Até o próximo abastecimento. Base: 80 L disponíveis e consumo médio de 3,5 km/L.
            </Text>
            <View style={styles.routeEstimate}>
              <Text style={styles.routeEstimateText}>
                Percurso previsto: 120 km · Margem: 160 km
              </Text>
            </View>
            <Text style={styles.helperText}>
              Estimativa sujeita ao trânsito, à carga e às condições de condução.
            </Text>
          </View>
        </View>

        <SectionTitle>Finalização da escala</SectionTitle>
        <Pressable
          accessibilityRole="button"
          disabled={!ended || deliveryChecklistDone}
          onPress={openDeliveryChecklist}
          style={[
            styles.deliveryCard,
            (!ended || deliveryChecklistDone) && styles.deliveryCardDisabled,
          ]}
        >
          <View style={styles.deliveryIcon}>
            <Ionicons
              color={deliveryChecklistDone ? COLORS.green : COLORS.muted}
              name={deliveryChecklistDone ? 'checkbox' : 'clipboard-outline'}
              size={17}
            />
          </View>
          <View style={styles.deliveryCopy}>
            <Text style={styles.checklistTitle}>Checklist de Entrega</Text>
            <Text style={styles.deliveryStatus}>
              {deliveryChecklistDone
                ? 'Concluído'
                : ended
                  ? 'Pendente · Toque para preencher'
                  : 'Pendente · Disponível ao encerrar'}
            </Text>
          </View>
          {!ended ? (
            <Ionicons color={COLORS.muted} name="lock-closed-outline" size={15} />
          ) : null}
          <Text style={styles.checklistDescription}>
            Ao terminar a operação, registre o horário e o km final e conclua a inspeção de entrega para liberar a finalização.
          </Text>
        </Pressable>
        <ActionButton
          disabled={!canFinalize}
          icon="checkmark"
          label={finalized ? 'Escala Finalizada' : 'Finalizar Escala'}
          onPress={finalizeScale}
        />
        <Text style={styles.finalizeHelper}>
          {finalized
            ? 'Operação finalizada.'
            : canFinalize
              ? 'Todos os registros foram concluídos.'
              : 'Disponível após encerrar a operação e concluir o checklist de entrega.'}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  header: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    height: 56,
    paddingHorizontal: 18,
  },
  backButton: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    marginRight: 4,
    width: 22,
  },
  headerCopy: {
    flex: 1,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '500',
  },
  headerDate: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 3,
  },
  content: {
    paddingHorizontal: 14,
    paddingBottom: 18,
    paddingTop: 13,
  },
  scaleCard: {
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
  scaleCardHeader: {
    alignItems: 'center',
    backgroundColor: COLORS.red,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 35,
    paddingHorizontal: 13,
  },
  cardHeaderTitle: {
    color: COLORS.surface,
    fontSize: 12,
    fontWeight: '700',
  },
  statusBadge: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    color: COLORS.redDark,
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
    backgroundColor: COLORS.surface,
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
    color: COLORS.text,
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
  sectionTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 7,
    marginTop: 4,
  },
  formCard: {
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
  cardSectionHeader: {
    backgroundColor: COLORS.red,
    justifyContent: 'center',
    minHeight: 35,
    paddingHorizontal: 13,
  },
  formContent: {
    padding: 13,
  },
  cardDescription: {
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 15,
  },
  formSectionTitle: {
    color: COLORS.red,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 10,
  },
  secondFormSection: {
    borderTopColor: COLORS.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 12,
    paddingTop: 10,
  },
  scheduledTimes: {
    borderBottomColor: COLORS.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    marginTop: 7,
    paddingBottom: 9,
  },
  scheduledTime: {
    flex: 1,
  },
  inputLabel: {
    color: COLORS.muted,
    fontSize: 10,
    marginBottom: 6,
  },
  scheduledTimeValue: {
    color: COLORS.text,
    fontSize: 18,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  inputColumn: {
    flex: 1,
    minWidth: 0,
  },
  inputContainer: {
    alignItems: 'center',
    borderColor: COLORS.border,
    borderRadius: 7,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 42,
    paddingHorizontal: 10,
  },
  input: {
    color: COLORS.text,
    flex: 1,
    fontSize: 13,
    minHeight: 40,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  inputUnit: {
    color: COLORS.muted,
    fontSize: 10,
    marginLeft: 5,
  },
  helperText: {
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 8,
  },
  checklistCard: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 11,
    paddingHorizontal: 13,
    paddingVertical: 12,
  },
  cardPressed: {
    opacity: 0.75,
  },
  checklistIcon: {
    marginRight: 8,
  },
  checklistCopy: {
    flex: 1,
  },
  checklistTitle: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '700',
  },
  checklistDone: {
    color: COLORS.red,
    fontSize: 10,
    marginTop: 3,
  },
  checklistDescription: {
    color: COLORS.muted,
    flexBasis: '100%',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 7,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: COLORS.gold,
    borderRadius: 10,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 11,
    height: 43,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  actionButtonDisabled: {
    backgroundColor: '#E1E2E2',
    elevation: 0,
    shadowOpacity: 0,
  },
  actionButtonPressed: {
    opacity: 0.8,
  },
  actionButtonText: {
    color: '#252525',
    fontSize: 12,
    fontWeight: '700',
  },
  actionButtonTextDisabled: {
    color: '#777777',
  },
  actionHelper: {
    color: COLORS.muted,
    fontSize: 10,
    marginBottom: 13,
    marginTop: -1,
  },
  autonomyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    elevation: 2,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  autonomyContent: {
    padding: 13,
  },
  autonomySummary: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8,
  },
  autonomyValue: {
    color: COLORS.text,
    fontSize: 21,
    marginRight: 5,
  },
  autonomyUnit: {
    color: COLORS.text,
    fontSize: 10,
  },
  routeEstimate: {
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 7,
  },
  routeEstimateText: {
    color: COLORS.muted,
    fontSize: 10,
  },
  deliveryCard: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 11,
    paddingHorizontal: 13,
    paddingVertical: 12,
  },
  deliveryCardDisabled: {
    backgroundColor: '#F6F6F6',
  },
  deliveryIcon: {
    marginRight: 8,
  },
  deliveryCopy: {
    flex: 1,
  },
  deliveryStatus: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 3,
  },
  finalizeHelper: {
    color: COLORS.muted,
    fontSize: 10,
    marginBottom: 8,
    marginTop: -1,
  },
});
