import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { Header, BottomTabBar, Colors } from "../../components";

export default function Abastecimento() {
  const router = useRouter();
  const [posto, setPosto] = useState("Selecione o posto");
  const [veiculo, setVeiculo] = useState("Ônibus 204 · FRT-2J48");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("22/10/2026");
  const [quilometragem, setQuilometragem] = useState("");
  const [litros, setLitros] = useState("");

  const selecionarPosto = () => {
    Alert.alert("Selecionar posto", "Escolha o posto", [
      { text: "Posto Ipiranga", onPress: () => setPosto("Posto Ipiranga") },
      { text: "Posto Shell", onPress: () => setPosto("Posto Shell") },
      { text: "Posto Petrobras", onPress: () => setPosto("Posto Petrobras") },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  const selecionarVeiculo = () => {
    Alert.alert("Selecionar veículo", "Escolha o veículo", [
      { text: "Ônibus 204 · FRT-2J48", onPress: () => setVeiculo("Ônibus 204 · FRT-2J48") },
      { text: "Ônibus 205 · ABC-1234", onPress: () => setVeiculo("Ônibus 205 · ABC-1234") },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  const registrarAbastecimento = () => {
    if (!posto || posto === "Selecione o posto" || !valor || !quilometragem || !litros) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
      return;
    }
    Alert.alert("Sucesso", "Abastecimento registrado com sucesso!");
  };

  const Campo = ({ label, value, onChangeText, placeholder, keyboardType = "default", sufixo }: any) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          keyboardType={keyboardType}
        />
        {sufixo ? <Text style={styles.suffix}>{sufixo}</Text> : null}
      </View>
    </View>
  );

  const Seletor = ({ label, value, onPress }: any) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.select} onPress={onPress}>
        <Text style={styles.selectText}>{value}</Text>
        <MaterialCommunityIcons name="chevron-down" size={23} color="#666" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Abastecimento Externo"
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

        <Text style={styles.sectionTitle}>Novo abastecimento</Text>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>Dados do abastecimento</Text>
          </View>

          <View style={styles.formContent}>
            <Text style={styles.description}>
              Registre abastecimentos feitos fora da garagem, conforme o comprovante do posto.
            </Text>

            <Seletor label="Posto cadastrado" value={posto} onPress={selecionarPosto} />
            <Seletor label="Veículo" value={veiculo} onPress={selecionarVeiculo} />

            <View style={styles.row}>
              <View style={styles.half}>
                <Campo
                  label="Valor pago"
                  value={valor}
                  onChangeText={setValor}
                  placeholder="0,00"
                  keyboardType="decimal-pad"
                  sufixo="R$"
                />
              </View>
              <View style={styles.half}>
                <View style={styles.field}>
                  <Text style={styles.label}>Data</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      value={data}
                      onChangeText={setData}
                      placeholder="DD/MM/AAAA"
                    />
                    <MaterialCommunityIcons name="calendar" size={21} color="#666" />
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.half}>
                <Campo
                  label="Quilometragem"
                  value={quilometragem}
                  onChangeText={setQuilometragem}
                  placeholder="—"
                  keyboardType="numeric"
                  sufixo="km"
                />
              </View>
              <View style={styles.half}>
                <Campo
                  label="Litros"
                  value={litros}
                  onChangeText={setLitros}
                  placeholder="—"
                  keyboardType="decimal-pad"
                  sufixo="L"
                />
              </View>
            </View>

            <Text style={styles.helperText}>
              Odômetro inicial da escala: 148.320 km. A quilometragem do abastecimento deve ser igual ou maior.
            </Text>

            <TouchableOpacity style={styles.submitButton} onPress={registrarAbastecimento}>
              <Text style={styles.submitText}>Registrar Abastecimento</Text>
              <MaterialCommunityIcons name="check" size={22} color="#222" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <BottomTabBar activeTab="escala" onTabPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  dateText: {
    color: "#777",
    fontSize: 13,
    marginTop: 16,
    marginBottom: 8,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 17,
  },
  card: {
    backgroundColor: "#F2F2F2",
    borderRadius: 17,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 10,
  },
  cardHeader: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  cardHeaderText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  formContent: {
    padding: 19,
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    color: "#777",
    marginBottom: 17,
  },
  field: {
    flex: 1,
    marginBottom: 17,
  },
  label: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
    marginBottom: 7,
  },
  inputContainer: {
    height: 51,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 8,
  },
  suffix: {
    fontSize: 13,
    color: "#777",
  },
  select: {
    height: 51,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 11,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: {
    fontSize: 16,
    color: "#555",
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  half: {
    flex: 1,
  },
  helperText: {
    color: "#777",
    fontSize: 13,
    lineHeight: 19,
    marginTop: -2,
    marginBottom: 17,
  },
  submitButton: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    elevation: 2,
  },
  submitText: {
    color: "#222",
    fontSize: 15,
    fontWeight: "500",
  },
});
