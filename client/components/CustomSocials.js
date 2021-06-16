import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { FontAwesome, Feather, AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import CustomEditModal from './CustomEditModal';

import * as dingActions from '../store/actions/ding';
import * as dingeActions from '../store/actions/dinge';

import { timeConverter } from '../helpers/timeConverter';
import Colors from '../constants/Colors';

const CustomSocials = (props) => {
  const {
    type,
    isLikeLoading,
    initLikeItem,
    itemState,
    item,
    authUser,
    user,
    locationState,
    onLike,
    onDelete,
    onFlag,
    onProfile,
  } = props;

  const [error, setError] = useState(undefined);
  const [editModal, setEditModal] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [editInitialText, setEditInitialText] = useState('');
  const [editDingId, setEditDingId] = useState(null);
  const [text, onChangeText] = useState(null);
  const [description, setDescription] = useState(item.description);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred', error, [{ text: 'Okay' }]);
    }
  }, [error]);

  const editEventHandler = (authUser, event) => {
    navigation.navigate('Create Event', { authUser, event });
  };

  const updateDescriptionHandler = async (dingId) => {
    setError(null);
    setIsEditLoading(true);
    try {
      await dispatch(dingActions.updateDingDescription(text, dingId));
      await dispatch(dingActions.getDing(dingId));
      await dispatch(dingeActions.getLocalDinge(locationState));
      setDescription(text);
    } catch (err) {
      setError(err.message);
    }
    onChangeText(null);
    setEditInitialText('');
    setIsEditLoading(false);
    setEditModal(false);
    cancelEditHandler();
  };

  const openEditorHandler = (id, text) => {
    setEditModal(true);
    setEditDingId(id);
    setEditInitialText(text);
  };

  const cancelEditHandler = () => {
    setEditModal(false);
    setEditInitialText('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <View style={styles.iconLeftContainer}>
          {isLikeLoading ? (
            <View style={styles.iconActInd}>
              <ActivityIndicator color={Colors.red} size="small" />
            </View>
          ) : (
            <FontAwesome
              name={initLikeItem ? 'thumbs-up' : 'thumbs-o-up'}
              color={initLikeItem ? Colors.red : 'black'}
              size={26}
              style={
                initLikeItem
                  ? styles.iconDingThumb
                  : [styles.iconDingThumb, { paddingRight: 5 }]
              }
              onPress={() => onLike(item._id, user._id)}
            />
          )}
          <Text style={styles.likesCount}>
            {itemState.likes && itemState.likes.length}
          </Text>
        </View>
        {item.user === authUser._id ? (
          <View style={styles.iconRightContainer}>
            {type === 'ding' ? (
              <Feather
                name="edit"
                color="black"
                size={26}
                style={styles.icon}
                onPress={() => openEditorHandler(item._id, item.description)}
              />
            ) : (
              <Feather
                name="edit"
                color="black"
                size={26}
                style={styles.icon}
                onPress={() => editEventHandler(authUser, item._id)}
              />
            )}
            <AntDesign
              name="delete"
              color="black"
              size={26}
              style={styles.icon}
              onPress={() => onDelete(item._id)}
            />
          </View>
        ) : (
          <Feather
            name="flag"
            color="black"
            size={26}
            style={styles.icon}
            onPress={onFlag}
          />
        )}
      </View>
      {type === 'ding' ? (
        <View style={styles.socialContainer}>
          <View style={styles.nameTimeContainer}>
            <Text style={styles.userName} onPress={onProfile}>
              {user.name}
            </Text>

            <Text style={styles.timeText}>{timeConverter(item.createdAt)}</Text>
          </View>
          <Text style={styles.description}>{description}</Text>
        </View>
      ) : null}
      <CustomEditModal
        editModal={editModal}
        text={text}
        item={item}
        isEditLoading={isEditLoading}
        editInitialText={editInitialText}
        editCommentId={editDingId}
        onEditModal={setEditModal}
        onText={onChangeText}
        onEdit={updateDescriptionHandler}
        onCancel={cancelEditHandler}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginHorizontal: 2,
  },
  iconContainer: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconLeftContainer: {
    flexDirection: 'row',
  },
  iconRightContainer: {
    flexDirection: 'row',
  },
  iconDingThumb: {
    marginRight: 12,
    padding: 3,
  },
  iconActInd: {
    marginRight: 10,
    paddingRight: 5,
    paddingLeft: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconClose: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  likesCount: {
    fontFamily: 'cereal-bold',
    color: 'black',
    fontSize: 20,
    marginRight: 12,
    padding: 3,
  },
  userName: {
    fontFamily: 'cereal-bold',
    fontSize: 20,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  icon: {
    marginLeft: 15,
  },
  description: {
    fontFamily: 'cereal-light',
    fontSize: 16,
  },
  nameTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontFamily: 'cereal-medium',
    fontSize: 18,
  },
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
  socialContainer: {
    marginVertical: 10,
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
  postButtonText: {
    color: 'white',
    fontFamily: 'cereal-bold',
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 16,
    alignSelf: 'center',
  },
  commentsContainer: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
});

export default CustomSocials;
