import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { API_BASE_URL } from '../../config/api';

interface Vaccine {
  name: string;
  lastGivenDate: string;
  due: string;
}

interface HealthRecord {
  _id: string;
  petId: string;
  lastVetVisit: string;
  vetVisitIntervalWeeks: number;
  vaccines: Vaccine[];
  dewormingLastDate: string;
  dewormingIntervalWeeks: number;
  weight: number;
}

interface PetInfo {
  name: string;
  breed: string;
  dob: string;
  type?: string;
}

const formatDate = (date: string | Date | null) => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
};

export default function HealthTrackerScreen() {
  const { petId } = useLocalSearchParams();
  const router = useRouter();
  const [health, setHealth] = useState<HealthRecord | null>(null);
  const [loading, setLoading] = useState(true);
  // Pet info state
  const [pet, setPet] = useState<PetInfo | null>(null);
  const [showVetPicker, setShowVetPicker] = useState(false);
  const [vetDate, setVetDate] = useState<Date | null>(null);
  const [vetInterval, setVetInterval] = useState('');
  const [pendingVetDate, setPendingVetDate] = useState<Date | null>(null);
  const [pendingVetInterval, setPendingVetInterval] = useState('');
  const [dewormDate, setDewormDate] = useState<Date | null>(null);
  const [dewormInterval, setDewormInterval] = useState('');
  const [weight, setWeight] = useState('');
  const [vaccineEdits, setVaccineEdits] = useState<Vaccine[]>([]);
  const [editingVaccineIdx, setEditingVaccineIdx] = useState<number | null>(null);
  const [editingVaccineField, setEditingVaccineField] = useState<'lastGivenDate' | 'due' | null>(null);
  const [showVaccinePicker, setShowVaccinePicker] = useState(false);
  const [vaccineDate, setVaccineDate] = useState<Date | null>(null);
  const [showDewormPicker, setShowDewormPicker] = useState(false);

  // Fetch pet info
  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/pets/${petId}`);
        if (!res.ok) throw new Error('Failed to fetch pet');
        const data = await res.json();
        setPet(data);
      } catch (err) {
        setPet(null);
      }
    };
    fetchPet();
  }, [petId]);

  // Fetch health record for this pet
  useEffect(() => {
    const fetchHealth = async () => {
      setLoading(true);
      try {
        // First, get health record id for this pet
        const res = await fetch(`${API_BASE_URL}/api/health-records/pet/${petId}`);
        if (!res.ok) throw new Error('No health record found');
        const record = await res.json();
        setHealth(record);
        setVetDate(record.lastVetVisit ? new Date(record.lastVetVisit) : null);
        setPendingVetDate(record.lastVetVisit ? new Date(record.lastVetVisit) : null);
        setVetInterval(record.vetVisitIntervalWeeks?.toString() || '');
        setPendingVetInterval(record.vetVisitIntervalWeeks?.toString() || '');
        setDewormDate(record.dewormingLastDate ? new Date(record.dewormingLastDate) : null);
        setDewormInterval(record.dewormingIntervalWeeks?.toString() || '');
        setWeight(record.weight?.toString() || '');
        setVaccineEdits(record.vaccines || []);
      } catch (err) {
        setHealth(null);
        Alert.alert('Error', 'Could not fetch health record.');
      } finally {
        setLoading(false);
      }
    };
    fetchHealth();
  }, [petId]);

  // PATCH helpers
  const patchField = async (field: string, value: any) => {
    if (!health) return;
    let url = `${API_BASE_URL}/api/health-records/${health._id}/${field}`;
    let body: any = {};
    body[field] = value;
    try {
      setLoading(true);
      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed to update');
      const updated = await res.json();
      setHealth(updated);
      if (field === 'lastVetVisit') {
        setVetDate(new Date(updated.lastVetVisit));
        setPendingVetDate(new Date(updated.lastVetVisit));
      }
      if (field === 'vetVisitIntervalWeeks') {
        setVetInterval(updated.vetVisitIntervalWeeks.toString());
        setPendingVetInterval(updated.vetVisitIntervalWeeks.toString());
      }
      if (field === 'dewormingLastDate') setDewormDate(new Date(updated.dewormingLastDate));
      if (field === 'dewormingIntervalWeeks') setDewormInterval(updated.dewormingIntervalWeeks.toString());
      if (field === 'weight') setWeight(updated.weight.toString());
      if (field === 'vaccines') setVaccineEdits(updated.vaccines);
    } catch (err) {
      Alert.alert('Error', 'Could not update.');
    } finally {
      setLoading(false);
    }
  };

  // PATCH both vet fields together
  const patchVetFields = async () => {
    if (!health) return;
    try {
      setLoading(true);
      // PATCH lastVetVisit
      let res = await fetch(`${API_BASE_URL}/api/health-records/${health._id}/lastVetVisit`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lastVetVisit: formatDate(pendingVetDate) }),
      });
      if (!res.ok) throw new Error('Failed to update last vet visit');
      let updated = await res.json();
      setHealth(updated);
      setVetDate(new Date(updated.lastVetVisit));
      setPendingVetDate(new Date(updated.lastVetVisit));
      // PATCH vetVisitIntervalWeeks
      res = await fetch(`${API_BASE_URL}/api/health-records/${health._id}/vetVisitIntervalWeeks`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vetVisitIntervalWeeks: Number(pendingVetInterval) }),
      });
      if (!res.ok) throw new Error('Failed to update vet visit interval');
      updated = await res.json();
      setHealth(updated);
      setVetInterval(updated.vetVisitIntervalWeeks.toString());
      setPendingVetInterval(updated.vetVisitIntervalWeeks.toString());
      Alert.alert('Success', 'Vet visit info updated!');
    } catch (err) {
      Alert.alert('Error', 'Could not update vet visit info.');
    } finally {
      setLoading(false);
    }
  };

  // Vaccine editing
  const handleVaccineEdit = (idx: number, key: keyof Vaccine, value: string) => {
    setVaccineEdits((prev) => prev.map((v, i) => i === idx ? { ...v, [key]: value } : v));
  };
  // Vaccine date change handler
  const handleVaccineDateChange = (idx: number, field: 'lastGivenDate' | 'due', date: Date) => {
    setVaccineEdits((prev) => prev.map((v, i) => i === idx ? { ...v, [field]: formatDate(date) } : v));
    setEditingVaccineIdx(null);
    setEditingVaccineField(null);
    setShowVaccinePicker(false);
  };
  const handleVaccineDueCalc = (idx: number, intervalWeeks: number) => {
    // Calculate due date from lastGivenDate + intervalWeeks
    const last = vaccineEdits[idx].lastGivenDate;
    if (!last) return;
    const due = new Date(last);
    due.setDate(due.getDate() + intervalWeeks * 7);
    setVaccineEdits((prev) => prev.map((v, i) => i === idx ? { ...v, due: formatDate(due) } : v));
  };
  const handleSaveVaccines = async () => {
    if (!health) return;
    await patchField('vaccines', vaccineEdits);
  };

  // Vaccine delete handler
  const handleDeleteVaccine = (idx: number) => {
    setVaccineEdits((prev) => prev.filter((_, i) => i !== idx));
  };

  // Helper for age
  const ageFromDob = (dob: string | undefined) => {
    if (!dob) return 'Unknown Age';
    const dobDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - dobDate.getFullYear();
    return age;
  };

  if (loading) return <ActivityIndicator size="large" color="#C74C58" style={{ marginTop: 40 }} />;
  if (!health) return <Text style={{ textAlign: 'center', marginTop: 40 }}>No health record found.</Text>;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/UserProfileScreen')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#f1787e" />
        </TouchableOpacity>
        <Text style={styles.title}>Health Tracker</Text>
        <View style={{ width: 32 }} />
      </View>
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      {/* Pet Info Card (below title) */}
      {pet && (
        <View style={styles.petCardTop}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={styles.petCardTitle}>{pet.name}</Text>
              <Text style={styles.petCardDetail}>{pet.breed}</Text>
              <Text style={styles.petCardDetail}>{ageFromDob(pet.dob)} years</Text>
            </View>
            {pet.type && (
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>{pet.type}</Text>
              </View>
            )}
          </View>
        </View>
      )}
      {/* Vet Visit */}
      <View style={styles.card}>
        <Text style={styles.label}>Last Vet Visit:</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.value}>{pendingVetDate ? formatDate(pendingVetDate) : 'Not set'}</Text>
          <TouchableOpacity onPress={() => setShowVetPicker(true)} style={{ marginLeft: 10 }} accessibilityLabel="Set Vet Visit Date">
            <Ionicons name="calendar" size={28} color="#C74C58" />
          </TouchableOpacity>
          {showVetPicker && (
            <DateTimePicker
              value={pendingVetDate || new Date()}
              mode="date"
              display="default"
              onChange={(_, date) => {
                setShowVetPicker(false);
                if (date) {
                  setVetDate(date);
                  patchField('lastVetVisit', formatDate(date));
                }
              }}
            />
          )}
          {/* Show tick only if date changed */}
          {pendingVetDate && vetDate && formatDate(pendingVetDate) !== formatDate(vetDate) && (
            <TouchableOpacity
              disabled={loading}
              onPress={async () => {
                await patchVetFields();
              }}
              style={{ marginLeft: 10, opacity: loading ? 0.5 : 1 }}
              accessibilityLabel="Confirm Vet Visit Date"
            >
              <Ionicons name="checkmark-circle" size={32} color="#43A047" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.label}>Vet Visit Interval (weeks):</Text>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={pendingVetInterval}
          keyboardType="numeric"
          onChangeText={setPendingVetInterval}
          onBlur={() => {
            if (pendingVetInterval !== vetInterval) {
              patchField('vetVisitIntervalWeeks', Number(pendingVetInterval));
            }
          }}
        />
        {/* Next Vet Visit */}
        <Text style={styles.label}>Next Vet Visit:</Text>
        <Text style={styles.value}>
          {(() => {
            if (vetDate && vetInterval) {
              const intervalWeeks = parseInt(vetInterval, 10);
              let nextDate: Date | null = null;
              if (!isNaN(intervalWeeks)) {
                nextDate = new Date(vetDate);
                nextDate.setDate(nextDate.getDate() + intervalWeeks * 7);
                return formatDate(nextDate instanceof Date ? nextDate : null);
              }
            }
            return 'Not set';
          })()}
        </Text>
      </View>
      {/* Deworming */}
      <View style={styles.card}>
        <Text style={styles.label}>Last Deworming Date:</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.value}>{dewormDate ? formatDate(dewormDate) : 'Not set'}</Text>
          <TouchableOpacity onPress={() => setShowDewormPicker(true)} style={{ marginLeft: 10 }} accessibilityLabel="Set Deworming Date">
            <Ionicons name="calendar" size={28} color="#C74C58" />
          </TouchableOpacity>
          {showDewormPicker && (
            <DateTimePicker
              value={dewormDate || new Date()}
              mode="date"
              display="default"
              onChange={(_, date) => {
                setShowDewormPicker(false);
                if (date) {
                  setDewormDate(date);
                  patchField('dewormingLastDate', formatDate(date));
                }
              }}
            />
          )}
        </View>
        <Text style={styles.label}>Deworming Interval (weeks):</Text>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={dewormInterval}
          keyboardType="numeric"
          onChangeText={setDewormInterval}
          onBlur={() => {
            if (dewormInterval !== (health?.dewormingIntervalWeeks?.toString() || '')) {
              patchField('dewormingIntervalWeeks', Number(dewormInterval));
            }
          }}
        />
        {/* Next Deworming */}
        <Text style={styles.label}>Next Deworming:</Text>
        <Text style={styles.value}>
          {(() => {
            let nextDate: Date | null = null;
            if (dewormDate && dewormInterval) {
              const intervalWeeks = parseInt(dewormInterval, 10);
              if (!isNaN(intervalWeeks)) {
                nextDate = new Date(dewormDate);
                nextDate.setDate(nextDate.getDate() + intervalWeeks * 7);
              }
            }
            return formatDate(nextDate);
          })()}
        </Text>
      </View>
      {/* Weight */}
      <View style={styles.card}>
        <Text style={styles.label}>Weight (kg):</Text>
        <TextInput
          style={styles.input}
          value={weight}
          keyboardType="numeric"
          onChangeText={setWeight}
          onBlur={() => patchField('weight', Number(weight))}
        />
      </View>
      {/* Vaccines Table */}
      <View style={styles.card}>
        <Text style={styles.label}>Vaccines:</Text>
        <View style={[styles.tableHeader, {borderColor: '#C74C58'}]}>
          <Text style={[styles.tableCell, { flex: 0.72 }]}>Name</Text>
          <Text style={styles.tableCell}>Last Given</Text>
          <Text style={styles.tableCell}>Due</Text>
        </View>
        {vaccineEdits.map((v, idx) => (
          <View key={idx} style={[styles.tableRow, { alignItems: 'center' }]}> 
            <TextInput
              style={[styles.tableCell, { flex: 2, borderBottomWidth: 1, borderColor: '#eee', minWidth: 40 }]}
              value={v.name}
              onChangeText={(text) => handleVaccineEdit(idx, 'name', text)}
            />
            {/* Last Given Date with date picker */}
            <View style={[styles.tableCell, { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#eee', minWidth: 90 }]}> 
              <Text>{v.lastGivenDate ? formatDate(v.lastGivenDate) : 'Set Date'}</Text>
              <TouchableOpacity
                onPress={() => {
                  setEditingVaccineIdx(idx);
                  setEditingVaccineField('lastGivenDate');
                  setShowVaccinePicker(true);
                  setVaccineDate(v.lastGivenDate ? new Date(v.lastGivenDate) : new Date());
                }}
                style={{ marginLeft: 8 }}
                accessibilityLabel="Set Last Given Date"
              >
                <Ionicons name="calendar" size={20} color="#C74C58" />
              </TouchableOpacity>
              {editingVaccineIdx === idx && editingVaccineField === 'lastGivenDate' && showVaccinePicker && (
                <DateTimePicker
                  value={vaccineDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(_, date) => {
                    setShowVaccinePicker(false);
                    if (date) handleVaccineDateChange(idx, 'lastGivenDate', date);
                  }}
                />
              )}
            </View>
            {/* Due Date with date picker */}
            <View style={[styles.tableCell, { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#eee', minWidth: 90, marginLeft: 0 }]}> 
              <Text>{v.due ? formatDate(v.due) : 'Set Date'}</Text>
              <TouchableOpacity
                onPress={() => {
                  setEditingVaccineIdx(idx);
                  setEditingVaccineField('due');
                  setShowVaccinePicker(true);
                  setVaccineDate(v.due ? new Date(v.due) : new Date());
                }}
                style={{ marginLeft: 8 }}
                accessibilityLabel="Set Due Date"
              >
                <Ionicons name="calendar" size={18} color="#C74C58" />
              </TouchableOpacity>
              {editingVaccineIdx === idx && editingVaccineField === 'due' && showVaccinePicker && (
                <DateTimePicker
                  value={vaccineDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(_, date) => {
                    setShowVaccinePicker(false);
                    if (date) handleVaccineDateChange(idx, 'due', date);
                  }}
                />
              )}
            </View>
            {/* Delete button */}
            <TouchableOpacity
              onPress={() => handleDeleteVaccine(idx)}
              style={{ marginLeft: -15, padding: 4 }}
              accessibilityLabel="Delete Vaccine"
            >
              <Ionicons name="trash" size={20} color="#d9534f" />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setVaccineEdits([...vaccineEdits, { name: '', lastGivenDate: '', due: '' }])}
        >
          <Text style={styles.addButtonText}>+ Add Vaccine</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveVaccines}>
          <Text style={styles.saveButtonText}>Save Vaccines</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    width: '100%',
    borderRadius: 14,
    backgroundColor: '#FFE9EC',
    marginBottom: 24,
    padding: 18,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#C74C58',
    marginTop: 10,
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: '#232323',
    marginBottom: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#C74C58',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#232323',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderColor: '#1976D2',
    marginBottom: 4,
    paddingBottom: 2,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    padding: 4,
    color: '#232323',
  },
  addButton: {
    marginTop: 10,
    backgroundColor: '#C74C58',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: '#C74C58',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  petCardTop: {
    width: '100%',
    borderRadius: 14,
    backgroundColor: '#FFE9EC',
    marginBottom: 18,
    padding: 18,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  petCardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#C74C58',
    marginBottom: 2,
  },
  petCardDetail: {
    fontSize: 16,
    color: '#232323',
    marginBottom: 1,
  },
  petCardValue: {
    fontWeight: 'bold',
    color: '#C74C58',
  },
  typeBadge: {
    backgroundColor: '#C74C58',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  typeBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    textTransform: 'capitalize',
  },
});
