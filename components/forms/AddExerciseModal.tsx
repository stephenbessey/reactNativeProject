import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import { SelectionButton } from '../SelectionButton';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  description?: string;
}

interface AddExerciseModalProps {
  visible: boolean;
  onClose: () => void;
  onAddExercise: (exercise: Exercise) => void;
}

export const AddExerciseModal: React.FC<AddExerciseModalProps> = ({
  visible,
  onClose,
  onAddExercise,
}) => {
  const [exerciseName, setExerciseName] = useState('Push-ups');

  const handleAdd = () => {
    const exercise: Exercise = {
      name: exerciseName,
      sets: 3,
      reps: 10,
      description: 'Basic exercise',
    };
    onAddExercise(exercise);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Add Exercise</Text>
          <Text style={styles.subtitle}>Add a new exercise to your workout</Text>
          
          <View style={styles.buttons}>
            <SelectionButton 
              title={`Add ${exerciseName}`} 
              onPress={handleAdd} 
              variant="primary" 
            />
            <SelectionButton title="Cancel" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttons: {
    gap: 10,
  },
});
