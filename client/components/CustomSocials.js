import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

import { FontAwesome, Feather, AntDesign } from '@expo/vector-icons';

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
    onLike,
    onDelete,
    onFlag,
    onProfile,
  } = props;

  const description = JSON.parse(item.description);

  return (
    <View style={styles.socialIconsContainer}>
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
              size={28}
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
        <View style={styles.iconRightContainer}>
          <Feather
            name="flag"
            color="black"
            size={28}
            style={styles.icon}
            onPress={onFlag}
          />
          {item.user === authUser._id ? (
            <AntDesign
              name="delete"
              color="black"
              size={28}
              style={[styles.icon, { marginRight: 0 }]}
              onPress={() => onDelete(item._id)}
            />
          ) : null}
        </View>
      </View>
      {type === 'ding' ? (
        <View style={styles.socialContainer}>
          <Text style={styles.userName} onPress={() => onProfile(user._id)}>
            {user.name}
          </Text>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{timeConverter(item.createdAt)}</Text>
          </View>
          <Text style={styles.description}>{description}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  socialIconsContainer: {
    marginVertical: 10,
    marginHorizontal: 16,
  },
  iconContainer: {
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
  icon: {
    marginRight: 4,
    padding: 3,
  },
  iconActInd: {
    marginRight: 12,
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
  description: {
    fontFamily: 'cereal-light',
    fontSize: 16,
  },
  timeContainer: {
    flexDirection: 'column',
    position: 'absolute',
    right: 10,
  },
  timeText: {
    fontFamily: 'cereal-medium',
    fontSize: 20,
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
