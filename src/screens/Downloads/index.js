import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Linking,
  ScrollView,
  FlatList,
} from 'react-native';
import {styles} from './styles';
import {inject, observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import DynamicTabView from 'react-native-dynamic-tab-view';
import {ActivityIndicator} from 'react-native-paper';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import moment from 'moment';
import Toast from 'react-native-easy-toast';

export default observer(Downloads);
function Downloads(props) {
  let internet = store.General.isInternet;
  let downloads = store.Downloads.data;
  let loader = store.Downloads.loader;

  const toast = useRef(null);
  const [data, setdata] = useState(false);

  //hook

  useEffect(() => {
    if (internet) {
      store.Downloads.getDataById();
    }
  }, [internet]);

  useEffect(() => {
    if (downloads.length > 0) {
      setDataWithFilter();
    } else {
      setdata([]);
    }
  }, [downloads]);

  // method

  const setDataWithFilter = () => {
    let dt = downloads.slice();

    const did = dt //duplicate id
      .map(v => v.book._id)
      .filter((v, i, vIds) => vIds.indexOf(v) !== i);
    const uarray = [...new Set(did)]; //unique array

    let di = []; //duplicate ids
    if (uarray.length > 0) {
      uarray.map((e, i, a) => {
        let ad = [e];

        const duplicates = dt.filter(obj => ad.includes(obj.book._id));

        if (duplicates.length > 0) {
          console.log('u arr data : ', duplicates);

          duplicates.map((e, i, a) => {
            if (i < a.length - 1) {
              di.push(e._id);
            }
          });
        }
      });
    }

    let fd = downloads.slice();
    let dind = []; //duplicate index
    if (di.length > 0) {
      di.map((e, i, a) => {
        const index = fd.findIndex(object => {
          return object._id === e;
        });
        if (index > -1) {
          dind.push(index);
        }
      });

      console.log('deleted index : ', dind);

      setdata(downloads);
    }

    let ddd = [];
    if (dind.length > 0) {
      ddd = fd.filter(function (value, index) {
        return dind.indexOf(index) == -1;
      });
    } else {
      ddd = fd;
    }
    //sort exp+ire data
    // if (ddd.length > 0) {
    //   ddd.sort(function (a, b) {
    //     var x = a.expired == false ? -1 : 1;
    //     return x;
    //   });
    // }

    setdata(ddd);
  };

  const goBack = () => {
    props.navigation.goBack();
  };

  const formateDateTime = d => {
    var tt = moment(d).format('hh:mm a');
    var dd = moment(d).format('DD-MM-Y');
    return dd + ', ' + tt;
  };

  // render

  const renderItems = ({item, index}) => {
    const e = item;
    const i = index;
    const a = data.length;

    const dt = e;
    const book = dt.book;

    return (
      <utils.BookCardDownload
        data={dt}
        book={book}
        nav={props.navigation}
        screen="downloads"
        toast={toast}
        all={data}
      />
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
        <Text style={styles.htitle}>My Downloads</Text>
      </View>
    );
  };

  const renderLoad = () => {
    return (
      <ActivityIndicator
        size={40}
        color={theme.color.button1}
        style={{position: 'absolute', top: '45%', alignSelf: 'center'}}
      />
    );
  };

  const renderEmptyData = () => {
    return (
      <View style={styles.emptySECTION}>
        <Image
          style={styles.emptyImg}
          source={require('../../assets/images/empty/img.png')}
        />
        <Text style={styles.emptyText}>Sorry!</Text>
        <Text style={[styles.emptyText, {marginTop: -5}]}>
          Currently no books are available here
        </Text>
      </View>
    );
  };

  const renderShowData = () => {
    return (
      <FlatList
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={renderItems}
        keyExtractor={(item, index) => {
          return index.toString();
        }}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        removeClippedSubviews={true}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {!internet && <utils.InternetMessage />}
      <Toast ref={toast} position="bottom" />
      {renderHeader()}

      {loader && renderLoad()}
      {!loader && data != false && data.length <= 0 && renderEmptyData()}
      {!loader && data != false && data.length > 0 && renderShowData()}
    </SafeAreaView>
  );
}
