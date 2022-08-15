import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TouchableHighlight,
  StatusBar,
  BackHandler,
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  Dimensions,
  FlatList,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geocoder from 'react-native-geocoding';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import DynamicTabView from 'react-native-dynamic-tab-view';
import ImageSlider from 'react-native-image-slider';
import FastImage from 'react-native-fast-image';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-easy-toast';
import MaskedView from '@react-native-community/masked-view';
import Svg, {Path} from 'react-native-svg';
import RBSheet from 'react-native-raw-bottom-sheet';
import {ActivityIndicator} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';

export default observer(Home2);
function Home2(props) {
  const toast = useRef(null);
  const toastduration = 700;

  const [Loader, setLoader] = useState(false);

  const [Resturants, setResturants] = useState([
    {
      name: 'BroadWay Pizza',
      type: 'Pizza',
      promotions: true,
      loc: {
        coords: {latitude: 33.62497365767188, longitude: 72.96931675031028},
        address: 'D Chowk, Islamabad',
      },
      rating: {
        average_rating: 4.5,
        total_reviews: 555,
        details: [
          {
            user_name: 'Imran Khan',
            rate: 3,
            comment: 'Taste and quantity were good',
            created_at: 'Aug 2, 2022',
          },
          {
            user_name: 'Nawaz Shareef',
            rate: 4,
            comment:
              'Urna libero massa in pulvinar aliquet morbi eu, cursus pulvinar duis molestie at enim euismod vitae ipsum risus tincidunt tellus donec risus',
            created_at: 'Aug 1, 2022',
          },
          {
            user_name: 'James Bond',
            rate: 3,
            comment: '',
            created_at: 'Aug 1, 2022',
          },
        ],
      },
      opening_times: [
        {day: 'Mon', open: '9 am', close: '4 pm'},
        {day: 'Tue', open: '9 am', close: '5 pm'},
        {day: 'Wed', open: '9 am', close: '7 pm'},
        {day: 'Thu', open: '9 am', close: '4 pm'},
        {day: 'Fri', open: '1 pm', close: '8 pm'},
        {day: 'Sat', open: '', close: ''},
        {day: 'Sun', open: '', close: ''},
      ],
      order_type: 'delivery',
      deals: '',
      image: require('../../assets/images/pizza/img.jpeg'),
      delivery_charges: 80,
    },
    {
      name: 'AB Cuisine',
      type: 'Fast Food',
      promotions: true,
      image: require('../../assets/images/burger/img.jpeg'),
      loc: {
        coords: {latitude: 33.64581985471614, longitude: 72.97007398160882},
        address: 'J Mall, Islamabad',
      },
      rating: {
        average_rating: 4,
        total_reviews: 455,
        details: [
          {
            user_name: 'Imran Khan',
            rate: 3,
            comment: 'Taste and quantity were good',
            created_at: 'Aug 2, 2022',
          },
          {
            user_name: 'Nawaz Shareef',
            rate: 4,
            comment:
              'Urna libero massa in pulvinar aliquet morbi eu, cursus pulvinar duis molestie at enim euismod vitae ipsum risus tincidunt tellus donec risus',
            created_at: 'Aug 1, 2022',
          },
          {
            user_name: 'James Bond',
            rate: 3,
            comment: '',
            created_at: 'Aug 1, 2022',
          },
        ],
      },
      opening_times: [
        {day: 'Mon', open: '9 am', close: '4 pm'},
        {day: 'Tue', open: '9 am', close: '5 pm'},
        {day: 'Wed', open: '9 am', close: '7 pm'},
        {day: 'Thu', open: '9 am', close: '4 pm'},
        {day: 'Fri', open: '1 pm', close: '8 pm'},
        {day: 'Sat', open: '', close: ''},
        {day: 'Sun', open: '', close: ''},
      ],
      order_type: 'delivery',
      deals: 'Summer deals & discounts',
      delivery_charges: 50,
    },
  ]);

  const [data, setData] = useState([]); //all resturants
  const [exclusiveData, setexclusiveData] = useState([]);
  const [summerDealsData, setsummerDealsData] = useState([]);

  const gapikey = 'AIzaSyC75RWT0q9xkASq2YhX2vGi1R-e_p2pnWU';
  let screen = props.route.params.screen || '';
  let type = props.route.params.type || '';
  let internet = store.General.isInternet;
  let loc = store.User.location;
  let tagLine = '';

  useEffect(() => {
    if (Resturants.length > 0) {
      setTimeout(() => {
        getTravelTime();
      }, 70);
    }
  }, [Resturants]);

  useEffect(() => {
    if (data.length > 0) {
      let er = [];
      let sd = [];
      data.map((e, i, a) => {
        if (e.promotions == true) {
          er.push(e);
        }
        if (e.deals == 'Summer deals & discounts') {
          sd.push(e);
        }
      });
      setexclusiveData(er);
      setsummerDealsData(sd);
    }
  }, [data]);

  const renderHeader = () => {
    const setloader = c => {
      setLoader(c);
      setTimeout(() => {
        setLoader(false);
      }, 3000);
    };

    const onClickBack = () => {
      props.navigation.goBack();
    };

    const onClickLoc = () => {
      props.navigation.navigate('Map', {screen: 'home2', setloader});
    };

    const onClickCart = () => {};

    const onClickSearch = () => {};

    const onClickOption = () => {};

    const renderBack = () => {
      return (
        <TouchableOpacity
          style={{width: '10%'}}
          activeOpacity={0.6}
          onPress={onClickBack}>
          <utils.vectorIcon.Ionicons
            name="arrow-back-sharp"
            color={theme.color.button1}
            size={24}
          />
        </TouchableOpacity>
      );
    };

    const renderLoc = () => {
      let adrs = loc.adrs;
      let city = loc.city_name;
      let orderType =
        type == 'delivery'
          ? 'Food delivery'
          : type == 'pickup'
          ? 'Pick-Up'
          : '';

      return (
        <TouchableOpacity
          disabled
          activeOpacity={0.7}
          onPress={onClickLoc}
          style={styles.locContainer}>
          <View style={{width: '100%'}}>
            <Text style={styles.locText} numberOfLines={1} ellipsizeMode="tail">
              {adrs}
            </Text>
            <Text
              style={[styles.locText2, {textTransform: 'none'}]}
              numberOfLines={1}
              ellipsizeMode="tail">
              {orderType}
            </Text>
          </View>
        </TouchableOpacity>
      );
    };

    const renderCart = () => {
      return (
        <TouchableOpacity activeOpacity={0.6} onPress={onClickCart}>
          <utils.vectorIcon.Ionicons
            name="ios-cart-outline"
            color={theme.color.button1}
            size={26}
          />
        </TouchableOpacity>
      );
    };

    const renderSeacrh = () => {
      return (
        <View style={styles.header2}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={onClickOption}
            style={styles.searchContainer}>
            <utils.vectorIcon.AntDesign
              name="search1"
              color={theme.color.subTitleLight}
              size={20}
            />
            <Text style={styles.searchContainerText}>
              Search for restaurants
            </Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.6} onPress={onClickOption}>
            <utils.vectorIcon.Ionicons
              name="options-outline"
              color={theme.color.button1}
              size={26}
            />
          </TouchableOpacity>
        </View>
      );
    };

    let styl =
      Platform.OS == 'android'
        ? {}
        : {
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.6,
            shadowRadius: 1,
          };

    return (
      <View style={styles.headerConatainer}>
        <View style={[styles.header1, styl]}>
          {renderBack()}
          {renderLoc()}
          {renderCart()}
        </View>
        {renderSeacrh()}
      </View>
    );
  };

  const getTravelTime = () => {
    let arr = [];
    for (let i = 0; i < Resturants.length; i++) {
      const e = Resturants[i];
      let a = Resturants;

      var urlToFetchDistance =
        'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric?mode=driving&origins=' +
        loc.coords.latitude +
        ',' +
        loc.coords.longitude +
        '&destinations=' +
        e.loc.coords.latitude +
        '%2C' +
        e.loc.coords.longitude +
        '&key=' +
        gapikey;

      try {
        fetch(urlToFetchDistance)
          .then(res => {
            return res.json();
          })
          .then(res => {
            if (res) {
              console.log('fetchdsistancematric res true ');
              if (res?.rows.length > 0) {
                let distanceInMeter = res.rows[0].elements[0].distance.value; //in meter
                let distanceInKm = distanceInMeter / 1000; //in meter to km
                e.total_distance = distanceInKm.toFixed(1) || 0; //meter to km

                var timeSecond = res.rows[0].elements[0].duration.value;
                e.travel_time = (timeSecond / 60).toFixed(); //sec to min
                arr.push(e);
              }
            }
            if (i == a.length - 1) {
              console.log('arr :  ', arr);
              setData(arr);
            }
          })
          .catch(error => {
            // utils.AlertMessage(
            //   "fetchdsistancematric api error ",
            //   "Network request failed"
            // );
            console.log('fetchdsistancematric catch error : ', error);
            return;
          });
      } catch (error) {
        console.log('fetchdsistancematric catch error ', error);
      }
    }
  };

  const renderResturants = (item, index, dt) => {
    let name = item.name || '';
    let ar = item.rating.average_rating || 0;
    let tr = item.rating.total_reviews;
    let type = item.type || '';
    let dc = item.delivery_charges || 0;
    let distance = item.distance || 0;
    let travel_time = item.travel_time || 0;
    let img = item.image;

    const rednerDistance = () => {
      return (
        <View style={styles.disContaniner}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.disContaninerText}>
            {travel_time} min
          </Text>
        </View>
      );
    };

    const renderHeart = () => {
      return (
        <View style={styles.heartContaniner}>
          <utils.vectorIcon.AntDesign
            name="hearto"
            color={theme.color.subTitle}
            size={15}
          />
        </View>
      );
    };

    let styl =
      Platform.OS == 'android'
        ? {}
        : {
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 0.7},
            shadowOpacity: 0.5,
            shadowRadius: 1,
          };

    return (
      <View
        style={[
          styles.efcContainer,
          {
            marginLeft: index <= 0 ? 20 : 10,
            marginRight: index == dt.length - 1 ? 20 : 0,
          },
        ]}>
        <View style={styles.efc1}>
          <Image source={img} style={styles.efcImage} />
          {rednerDistance()}
          {renderHeart()}
        </View>

        <View style={styles.efc2}>
          <View style={styles.efc21}>
            <View style={{width: '63%'}}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.efc21Text1}>
                {name}
              </Text>
            </View>
            <View
              style={{
                width: '35%',
                alignItems: 'flex-end',
                flexDirection: 'row',
              }}>
              <utils.vectorIcon.Entypo
                name="star"
                color={theme.color.rate}
                size={14}
                style={{top: -4}}
              />
              <Text style={styles.efc21Text2}>{ar}</Text>
              <Text
                style={[styles.efc21Text2, {color: theme.color.subTitleLight}]}>
                ({tr > 500 ? '500+' : tr})
              </Text>
            </View>
          </View>

          <View style={styles.efc22}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.efc22Text1}>
              $$ • {type}
            </Text>
          </View>

          <View style={styles.efc33}>
            <utils.vectorIcon.MaterialIcons
              name="delivery-dining"
              color={theme.color.subTitleLight}
              size={18}
            />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.efc33Text1}>
              Rs. {dc}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderMain = () => {
    return (
      <>
        <View style={styles.mainSec1}>
          <Text style={styles.mainSecText}>Exclusives</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={exclusiveData}
            renderItem={({item, index}) =>
              renderResturants(item, index, exclusiveData)
            }
            keyExtractor={(item, index) => {
              return index.toString();
            }}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            removeClippedSubviews={true}
            onEndReached={e => {
              console.log('   onEndReached : ');
              // setisEndReachFlatlist(true);
            }}
          />
        </View>

        <View style={styles.mainSec2}>
          <Text style={styles.mainSecText}>Summer deals & discounts</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={summerDealsData}
            renderItem={({item, index}) =>
              renderResturants(item, index, summerDealsData)
            }
            keyExtractor={(item, index) => {
              return index.toString();
            }}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            removeClippedSubviews={true}
            onEndReached={e => {
              console.log('   onEndReached : ');
              // setisEndReachFlatlist(true);
            }}
          />
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <utils.Loader2 load={Loader} />
      {!internet && (
        <utils.InternetMessage
          color={tagLine != '' ? 'red' : theme.color.button1}
        />
      )}

      {renderHeader()}
      <ScrollView contentContainerStyle={{paddingVertical: 20}}>
        {renderMain()}
      </ScrollView>
      <Toast ref={toast} position="bottom" />
    </SafeAreaView>
  );
}
