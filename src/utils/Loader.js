import React from 'react';
import {View, Modal, ActivityIndicator, Text, StatusBar} from 'react-native';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import theme from '../theme/index';
import {spinner} from 'react-native-paper';

export default function Loader(props) {
  let text = props.text || '';

  return (
    <Modal animationType="fade" transparent={true} visible={props.load}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.3)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 60,
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 15,
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: 15,
          }}>
          <ActivityIndicator size={50} color={'white'} />
          {text != '' && (
            <Text
              style={{
                color: 'white',
                marginTop: 10,
                fontSize: 15,
                fontFamily: theme.fonts.fontNormal,
              }}>
              {text}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
}
