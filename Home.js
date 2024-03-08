import React, { useState, useEffect } from 'react';
import { useNavigation } from "@react-navigation/native";
import { TextInput, StyleSheet, Text, View, TouchableOpacity, Button, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
    const navigation = useNavigation();
    const [task, setTask] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date());
    const [tasks, setTasks] = useState([]);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [image, setImage] = useState(null);

    // Solicitar permissão para acessar a galeria de imagens
    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('É necessário permissão para acessar a galeria de imagens.');
            }
        })();
    }, []);

   // Função para adicionar uma nova tarefa
const addTask = () => {
    if (task.trim() !== '') {
        const newTask = { id: tasks.length + 1, title: task, description: description, date: date, completed: false, image: image };
        setTasks([...tasks, newTask]);
        setTask('');
        setDescription('');
        setDate(new Date());
        setImage(null);
    }
};


    // Função para selecionar uma data
    const selectDate = () => {
        setShowDatePicker(true);
    };

    // Função para lidar com a mudança de data no DateTimePicker
    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    // Função para formatar a data como string
    const formatDate = (date) => {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
    };

    // Função para cancelar uma tarefa
    const cancelTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    // Função para concluir uma tarefa
    const completeTask = (id) => {
        const updatedTasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: true };
            }
            return task;
        });
        setTasks(updatedTasks);
    };

    // Função para selecionar uma imagem da galeria
const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });

    if (!result.cancelled) {
        setImage(result.uri);
    }
};


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lista de Tarefas</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite uma nova tarefa"
                value={task}
                onChangeText={text => setTask(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Descrição"
                value={description}
                onChangeText={text => setDescription(text)}
            />
            <TouchableOpacity style={styles.datePickerButton} onPress={selectDate}>
                <Text style={styles.datePickerText}>Selecionar Data: {formatDate(date)}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imagePickerButton} onPress={selectImage}>
                <Text style={styles.imagePickerText}>Adicionar Imagem</Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}
            <View style={styles.buttonContainer}>
                <Button title="Adicionar Tarefa" onPress={addTask} />
            </View>
            <View style={styles.taskList}>
                {tasks.map(task => (
                  <View key={task.id} style={[styles.taskItem, task.completed && styles.completedTask]}>
                  <View style={styles.taskInfo}>
                      <TouchableOpacity onPress={() => navigation.navigate('EditTask', { taskId: task.id })}>
                          <Text style={styles.taskTitle}>{task.title}</Text>
                          <Text style={styles.taskDescription}>{task.description}</Text>
                          <Text style={styles.taskDate}>Data: {formatDate(task.date)}</Text>
                      </TouchableOpacity>
                  </View>
                  <View style={styles.taskActions}>
                      <TouchableOpacity style={styles.actionButton} onPress={() => cancelTask(task.id)}>
                          <Text style={styles.actionButtonText}>Cancelar</Text>
                      </TouchableOpacity>
                      {!task.completed && (
                          <TouchableOpacity style={[styles.actionButton, styles.completeButton]} onPress={() => completeTask(task.id)}>
                              <Text style={styles.actionButtonText}>Concluir</Text>
                          </TouchableOpacity>
                      )}
                      
                  </View>
                  {task.image && <Image source={{ uri: task.image }} style={styles.taskImage} />}
              </View>
              
               
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    datePickerButton: {
        marginBottom: 20,
    },
    datePickerText: {
        fontSize: 16,
        color: 'blue',
    },
    imagePickerButton: {
        marginBottom: 20,
    },
    imagePickerText: {
        fontSize: 16,
        color: 'green',
    },
    buttonContainer: {
        marginBottom: 20,
    },
    taskList: {
        width: '100%',
    },
    taskItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
    },
    completedTask: {
        backgroundColor: '#d7ffd9',
    },
    taskInfo: {
        flex: 1,
    },
    taskActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    taskTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    taskDescription: {
        fontSize: 16,
        marginBottom: 5,
    },
    taskDate: {
        fontSize: 16,
        color: 'gray',
    },
    actionButton: {
        marginLeft: 10,
        padding: 5,
        borderRadius: 5,
    },
    completeButton: {
        backgroundColor: 'green',
    },
    actionButtonText: {
        color: 'blue',
    },
    taskImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
});
