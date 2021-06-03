import React from 'react';
import { View, Text, StyleSheet, Modal, ActivityIndicator } from 'react-native';

import CustomButton from '../components/CustomButton';
import Colors from '../constants/Colors';

const CustomDeleteModal = (props) => {
  const {
    item,
    confirmDelete,
    setConfirmDelete,
    isDeleting,
    message,
    onDelete,
  } = props;

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmDelete}
        onRequestClose={() => {
          setConfirmDelete(!confirmDelete);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Are you sure you want to delete this {message}?
            </Text>
            <View style={styles.buttonContainer}>
              {isDeleting ? (
                <CustomButton
                  style={styles.buttonFlexRow}
                  onSelect={() => onDelete(item._id)}
                >
                  <Text style={styles.postButtonText}>Deleting...</Text>
                  <ActivityIndicator color="white" size="small" />
                </CustomButton>
              ) : (
                <CustomButton onSelect={() => onDelete(item._id)}>
                  <Text style={styles.postButtonText}>Yes</Text>
                </CustomButton>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalText: {
    fontFamily: 'cereal-medium',
    fontSize: 16,
    color: 'black',
  },
  reportText: {
    fontFamily: 'cereal-bold',
    fontSize: 20,
    color: Colors.primary,
    padding: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    paddingBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  right: {
    width: '100%',
  },
  commentsInput: {
    width: '80%',
    backgroundColor: Colors.lightBlue,
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: 10,
    fontSize: 16,
    fontFamily: 'cereal-light',
  },
  buttonContainer: {
    width: 170,
    marginVertical: 10,
  },
  buttonFlexRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  postButtonText: {
    color: 'white',
    fontFamily: 'cereal-bold',
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 16,
    alignSelf: 'center',
  },
});

export default CustomDeleteModal;
