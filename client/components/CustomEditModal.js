import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';

import CustomButton from '../components/CustomButton';
import Colors from '../constants/Colors';

const CustomEditModal = (props) => {
  const {
    editModal,
    text,
    ding,
    isEditLoading,
    editInitialText,
    editCommentId,
    onEditModal,
    onText,
    onEdit,
    onCancel,
  } = props;

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={editModal}
        onRequestClose={() => {
          onEditModal(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Edit comment:</Text>
            <TextInput
              style={[
                styles.commentsInput,
                { marginVertical: 10 },
                { width: '100%' },
              ]}
              onChangeText={onText}
              value={text}
              multiline={true}
              placeholder="write comment"
              defaultValue={editInitialText}
            />
            <View style={styles.buttonContainer}>
              {isEditLoading ? (
                <CustomButton
                  style={styles.buttonFlexRow}
                  onSelect={() => onEdit(editCommentId, ding._id)}
                >
                  <Text
                    style={[
                      styles.postButtonText,
                      { paddingHorizontal: 15, paddingVertical: 8 },
                    ]}
                  >
                    Loading...
                  </Text>
                  <ActivityIndicator color="white" size="small" />
                </CustomButton>
              ) : (
                <CustomButton onSelect={() => onEdit(editCommentId, ding._id)}>
                  <Text
                    style={[
                      styles.postButtonText,
                      { paddingHorizontal: 15, paddingVertical: 8 },
                    ]}
                  >
                    Confirm Edit
                  </Text>
                </CustomButton>
              )}
            </View>
            <View style={styles.buttonContainer}>
              <CustomButton onSelect={onCancel}>
                <Text
                  style={[
                    styles.postButtonText,
                    { paddingHorizontal: 15, paddingVertical: 8 },
                  ]}
                >
                  Cancel
                </Text>
              </CustomButton>
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
    marginVertical: 5,
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

export default CustomEditModal;
