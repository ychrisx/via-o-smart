import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { Header, BottomTabBar, Colors } from "../../components";

export default function ChecklistEntrega() {
  const router = useRouter();
  const [manutencao, setManutencao] = useState(true);
  const [abastecimentoInterno, setAbastecimentoInterno] = useState(false);
  const [lavagemExterna, setLavagemExterna] = useState(true);
  const [limpezaInterna, setLimpezaInterna] = useState(true);

  const salvarRascunho = () => {
    Alert.alert("Salvo", "Checklist de entrega salvo em rascunho.");
  };

  const finalizarChecklist = () => {
    Alert.alert("Sucesso", "Checklist de entrega finalizado com sucesso!");
  };

  return (
    <View style={styles.container}>
      <Header
        title="Checklist de Entrega"
        showBack
        onBack={() => router.back()}
        rightIcon={<MaterialCommunityIcons name="bell-outline" size={22} color="#fff" />}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.dateText}>Quinta-feira, 22 de outubro de 2026</Text>

        {/* Card info do ônibus */}
        <View style={styles.infoCard}>
          <View style={styles.infoCardTop}>
            <View style={styles.busInfoRow}>
              <MaterialCommunityIcons name="bus" size={20} color={Colors.primary} />
              <Text style={styles.busTitle}>Ônibus 204</Text>
            </View>
            <View style={styles.badgePreenchimento}>
              <Text style={styles.badgeText}>Em preenchimento</Text>
            </View>
          </View>
          <Text style={styles.busSub}>Placa FRT-2J48</Text>

          <View style={styles.divider} />

          <Text style={styles.scaleText}>Escala relacionada · 22/10/2026</Text>
          <Text style={styles.routeText}>São Paulo · Barra Funda</Text>
          <Text style={[styles.routeArrow, { color: Colors.primary }]}>↓</Text>
          <Text style={styles.routeText}>Cajamar · Centro logístico</Text>
          <Text style={styles.footerInfo}>Após a operação · Retorno previsto às 19:00</Text>
        </View>

        {/* Condições na entrega */}
        <Text style={styles.sectionHeaderTitle}>Condições na entrega</Text>

        {/* Mapa de avarias */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>Mapa de avarias</Text>
            <View style={styles.smallBadge}>
              <Text style={styles.smallBadgeText}>2 registros</Text>
            </View>
          </View>
          <View style={styles.formContent}>
            <Text style={styles.description}>
              Toque em uma região para registrar uma avaria.
            </Text>
            <Text style={styles.subLabel}>Lateral direita / Traseira</Text>

            <View style={styles.busSketch}>
              <MaterialCommunityIcons name="bus-side" size={60} color="#777" />
              <View style={[styles.avariaPin, { top: 35, left: "45%" }]}>
                <Text style={styles.pinText}>1</Text>
              </View>
              <View style={[styles.avariaPin, { top: 35, left: "75%", backgroundColor: Colors.primary }]}>
                <Text style={[styles.pinText, { color: "#FFF" }]}>2</Text>
              </View>
            </View>

            <View style={styles.avariaLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: Colors.accent }]} />
                <Text style={styles.legendText}>Inicial</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: Colors.primary }]} />
                <Text style={styles.legendText}>Nova</Text>
              </View>
            </View>

            <Text style={styles.alertSubPin}>2 · Traseira · Para-choque arranhado/amassado</Text>
          </View>
        </View>

        {/* Avarias iniciais */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>Avarias iniciais</Text>
            <View style={styles.smallBadge}>
              <Text style={styles.smallBadgeText}>1 sem alteração</Text>
            </View>
          </View>
          <View style={styles.formContent}>
            <View style={styles.avariaBox}>
              <View style={styles.avariaBoxHeader}>
                <View style={styles.avariaTagNum}>
                  <Text style={styles.avariaNumText}>1</Text>
                </View>
                <View>
                  <Text style={styles.avariaLoc}>Lateral direita · Bagageiro</Text>
                  <Text style={styles.avariaSubLoc}>Inicial · Saída às 14:30</Text>
                </View>
                <Text style={styles.gravityLeve}>Leve</Text>
              </View>
              <Text style={styles.avariaDesc}>
                Risco superficial no bagageiro lateral direito.
              </Text>
              <View style={styles.photoRow}>
                <View style={styles.photoPlaceholder}><Text style={styles.photoText}>JPG</Text></View>
                <View style={styles.photoPlaceholder}><Text style={styles.photoText}>JPG</Text></View>
                <Text style={styles.photoCount}>2 fotos anexadas</Text>
              </View>
              <View style={styles.comparisonBox}>
                <Text style={styles.comparisonTitle}>Comparação com a saída</Text>
                <Text style={styles.comparisonText}>
                  Sem alteração na entrega. Risco e gravidade permaneceram iguais ao registro inicial.
                </Text>
                <Text style={styles.linkText}>Ver registro e fotos da saída {">"}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Novas avarias */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>Novas avarias na entrega</Text>
            <View style={styles.smallBadge}>
              <Text style={styles.smallBadgeText}>1 registrada</Text>
            </View>
          </View>
          <View style={styles.formContent}>
            <View style={[styles.avariaBox, { borderColor: Colors.primary }]}>
              <View style={styles.avariaBoxHeader}>
                <View style={[styles.avariaTagNum, { backgroundColor: Colors.primary }]}>
                  <Text style={[styles.avariaNumText, { color: "#FFF" }]}>2</Text>
                </View>
                <View>
                  <Text style={styles.avariaLoc}>Traseira · Para-choque</Text>
                  <Text style={styles.avariaSubLoc}>Nova · Entrega às 19:00</Text>
                </View>
                <Text style={styles.gravityModerada}>Moderada</Text>
              </View>
              <Text style={styles.avariaDesc}>Trinca no para-choque traseiro direito.</Text>
              <View style={styles.photoRow}>
                <View style={styles.photoPlaceholder}><Text style={styles.photoText}>JPG</Text></View>
                <Text style={styles.photoCount}>1 foto anexada</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Serviços necessários */}
        <Text style={styles.sectionHeaderTitle}>Serviços necessários</Text>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>Solicitações para o veículo</Text>
            <View style={styles.smallBadge}>
              <Text style={styles.smallBadgeText}>3 necessárias</Text>
            </View>
          </View>
          <View style={styles.formContent}>
            <Text style={styles.description}>
              Selecione os serviços necessários após a entrega do ônibus.
            </Text>

            <TouchableOpacity style={styles.checkboxRow} onPress={() => setManutencao(!manutencao)}>
              <MaterialCommunityIcons name={manutencao ? "checkbox-marked" : "checkbox-blank-outline"} size={22} color={Colors.accent} />
              <View>
                <Text style={styles.checkboxTextBold}>Manutenção</Text>
                <Text style={styles.checkboxSubText}>Verificar avaria 2 - Para-choque traseiro</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.checkboxRow} onPress={() => setAbastecimentoInterno(!abastecimentoInterno)}>
              <MaterialCommunityIcons name={abastecimentoInterno ? "checkbox-marked" : "checkbox-blank-outline"} size={22} color={Colors.accent} />
              <Text style={styles.checkboxText}>Abastecimento interno</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.checkboxRow} onPress={() => setLavagemExterna(!lavagemExterna)}>
              <MaterialCommunityIcons name={lavagemExterna ? "checkbox-marked" : "checkbox-blank-outline"} size={22} color={Colors.accent} />
              <Text style={styles.checkboxText}>Lavagem externa</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.checkboxRow} onPress={() => setLimpezaInterna(!limpezaInterna)}>
              <MaterialCommunityIcons name={limpezaInterna ? "checkbox-marked" : "checkbox-blank-outline"} size={22} color={Colors.accent} />
              <Text style={styles.checkboxText}>Limpeza interna</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveDraftButton} onPress={salvarRascunho}>
              <Text style={styles.saveDraftText}>Salvar</Text>
              <MaterialCommunityIcons name="content-save-outline" size={18} color="#222" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitButton} onPress={finalizarChecklist}>
              <Text style={styles.submitText}>Finalizar Checklist</Text>
              <MaterialCommunityIcons name="check" size={20} color="#222" />
            </TouchableOpacity>

            <Text style={styles.footerNote}>
              Salvar mantém o checklist em rascunho. Finalize após conferir todos os registros.
            </Text>
          </View>
        </View>
      </ScrollView>

      <BottomTabBar activeTab="checklist" onTabPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 18, paddingBottom: 20 },
  dateText: { color: "#777", fontSize: 13, marginTop: 16, marginBottom: 12 },

  infoCard: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  infoCardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  busInfoRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  busTitle: { fontSize: 16, fontWeight: "bold", color: "#222" },
  badgePreenchimento: { backgroundColor: "#FFF3CD", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontSize: 11, color: "#856404", fontWeight: "bold" },
  busSub: { fontSize: 12, color: "#666", marginTop: 2 },
  divider: { height: 1, backgroundColor: "#EEE", marginVertical: 10 },
  scaleText: { fontSize: 12, color: "#555", fontWeight: "600" },
  routeText: { fontSize: 13, color: "#333" },
  routeArrow: { fontSize: 12, marginVertical: 2 },
  footerInfo: { fontSize: 11, color: "#777", marginTop: 8 },

  sectionHeaderTitle: { fontSize: 18, fontWeight: "bold", color: "#222", marginBottom: 12, marginTop: 5 },

  card: {
    backgroundColor: "#F2F2F2",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  cardHeader: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardHeaderText: { color: "#FFF", fontSize: 14, fontWeight: "bold" },
  smallBadge: { backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  smallBadgeText: { color: "#FFF", fontSize: 11 },
  formContent: { padding: 15 },
  description: { fontSize: 13, color: "#666", marginBottom: 10 },
  subLabel: { fontSize: 12, fontWeight: "600", color: "#444", marginBottom: 8 },

  busSketch: {
    height: 100,
    backgroundColor: "#FFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#DDD",
    position: "relative",
  },
  avariaPin: {
    position: "absolute",
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  pinText: { fontSize: 12, fontWeight: "bold", color: "#222" },
  avariaLegend: { flexDirection: "row", gap: 15, marginBottom: 8 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: "#666" },
  alertSubPin: { fontSize: 11, color: Colors.primary, marginTop: 4, fontWeight: "600" },

  avariaBox: { backgroundColor: "#FFF", borderRadius: 10, padding: 12, borderWidth: 1, borderColor: "#DDD" },
  avariaBoxHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  avariaTagNum: { width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.accent, justifyContent: "center", alignItems: "center" },
  avariaNumText: { fontSize: 12, fontWeight: "bold", color: "#222" },
  avariaLoc: { fontSize: 13, fontWeight: "bold", color: "#222" },
  avariaSubLoc: { fontSize: 11, color: "#777" },
  gravityLeve: { marginLeft: "auto", fontSize: 11, color: "#856404", fontWeight: "bold", backgroundColor: "#FFF3CD", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  gravityModerada: { marginLeft: "auto", fontSize: 11, color: "#721C24", fontWeight: "bold", backgroundColor: "#F8D7DA", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  avariaDesc: { fontSize: 12, color: "#555", marginBottom: 10 },
  photoRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 5 },
  photoPlaceholder: { width: 30, height: 30, backgroundColor: "#EEE", borderRadius: 4, justifyContent: "center", alignItems: "center" },
  photoText: { fontSize: 9, color: "#666" },
  photoCount: { fontSize: 11, color: "#777", marginLeft: 5 },

  comparisonBox: { backgroundColor: "#F9F9F9", padding: 10, borderRadius: 8, marginTop: 10, borderWidth: 1, borderColor: "#EEE" },
  comparisonTitle: { fontSize: 12, fontWeight: "bold", color: "#444", marginBottom: 3 },
  comparisonText: { fontSize: 11, color: "#666", lineHeight: 15, marginBottom: 6 },
  linkText: { fontSize: 11, color: Colors.primary, fontWeight: "600" },

  checkboxRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  checkboxText: { fontSize: 13, color: "#333" },
  checkboxTextBold: { fontSize: 13, color: "#333", fontWeight: "bold" },
  checkboxSubText: { fontSize: 11, color: "#777" },

  saveDraftButton: {
    backgroundColor: "#E5C158",
    borderRadius: 10,
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginBottom: 10,
    marginTop: 5,
  },
  saveDraftText: { color: "#222", fontSize: 14, fontWeight: "500" },
  submitButton: {
    backgroundColor: Colors.accent,
    borderRadius: 10,
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginBottom: 10,
  },
  submitText: { color: "#222", fontSize: 14, fontWeight: "bold" },
  footerNote: { fontSize: 11, color: "#777", textAlign: "center", marginTop: 5 },
});
