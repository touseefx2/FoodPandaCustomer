import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput} from 'react-native';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import Toast from 'react-native-easy-toast';
import NetInfo from '@react-native-community/netinfo';

export default observer(ChangePassword);
function ChangePassword(props) {
  const toast = useRef(null);
  const toastduration = 700;
  let loader = store.User.loader;

  const [currentPswd, setcurrentPswd] = useState('');
  const [showCurrentPswd, setshowCurrentPswd] = useState(false);
  const [pswd, setpswd] = useState('');
  const [spswd, setspswd] = useState(false);
  const [rpswd, setrpswd] = useState('');
  const [srpswd, setsrpswd] = useState(false);

  //method

  const goBack = () => {
    props.navigation.goBack();
  };

  const showSuccesOrder = () => {
    toast?.current?.show('Done', 500);

    setTimeout(() => {
      store.User.setLoader(false);
      goBack();
    }, 300);
  };

  const Update = () => {
    if (currentPswd === '') {
      toast?.current?.show('Please enter your current password');
      return;
    }

    if (pswd === '') {
      toast?.current?.show('Please enter new password');
      return;
    }

    if (pswd.length < 7) {
      toast?.current?.show('Password length must be greater than 6');
      return;
    }

    if (rpswd === '') {
      toast?.current?.show('Please re-enter new password');
      return;
    }
    if (pswd !== rpswd) {
      toast?.current?.show('Password do not match');
      return;
    }

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.User.ChangePassword(currentPswd, pswd, showSuccesOrder);
      } else {
        toast?.current?.show('Please connect internet', toastduration);
      }
    });
  };

  // render

  const renderBottomButton = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={Update}
        style={styles.bottomButton}>
        <Text style={styles.buttonText}>Update Password</Text>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.back}>
          <TouchableOpacity activeOpacity={0.6} onPress={goBack}>
            <utils.vectorIcon.Ionicons
              name="chevron-back"
              color={theme.color.title}
              size={26}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.htitle}>Change Password</Text>
      </View>
    );
  };

  const renderMainContent = () => {
    return (
      <View style={styles.contentContainer}>
        <View style={[styles.MobileInput, {marginTop: 0}]}>
          <TextInput
            secureTextEntry={!showCurrentPswd}
            style={styles.pswdInput}
            placeholderTextColor={theme.color.subTitle}
            placeholder="Enter your current password"
            value={currentPswd}
            onChangeText={val => {
              setcurrentPswd(val);
            }}
          />

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => setshowCurrentPswd(!showCurrentPswd)}>
            <utils.vectorIcon.Entypo
              name={!showCurrentPswd ? 'eye' : 'eye-with-line'}
              color={theme.color.subTitle}
              size={18}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.MobileInput}>
          <TextInput
            secureTextEntry={!spswd}
            style={styles.pswdInput}
            placeholderTextColor={theme.color.subTitle}
            placeholder="Enter your new password"
            value={pswd}
            onChangeText={val => {
              setpswd(val);
            }}
          />

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => setspswd(!spswd)}>
            <utils.vectorIcon.Entypo
              name={!spswd ? 'eye' : 'eye-with-line'}
              color={theme.color.subTitle}
              size={18}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.MobileInput}>
          <TextInput
            secureTextEntry={!srpswd}
            style={styles.pswdInput}
            placeholderTextColor={theme.color.subTitle}
            placeholder="Re-enter your password"
            value={rpswd}
            onChangeText={val => {
              setrpswd(val);
            }}
          />

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => setsrpswd(!srpswd)}>
            <utils.vectorIcon.Entypo
              name={!srpswd ? 'eye' : 'eye-with-line'}
              color={theme.color.subTitle}
              size={18}
            />
          </TouchableOpacity>
        </View>

        {renderBottomButton()}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <utils.Loader text={'Please wait'} load={loader} />
      {renderHeader()}

      <ScrollView showsVerticalScrollIndicator={false}>
        {renderMainContent()}
      </ScrollView>

      <Toast ref={toast} position="bottom" />
    </SafeAreaView>
  );
}
