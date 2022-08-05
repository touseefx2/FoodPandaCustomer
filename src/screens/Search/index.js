import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Linking,
  ScrollView,
  TextInput,
  FlatList,
  StatusBar,
} from 'react-native';
import {styles} from './styles';
import {inject, observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import {Searchbar} from 'react-native-paper';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import filter from 'lodash.filter';

export default observer(Search);
function Search(props) {
  const allcategory = props.route.params.data;
  const [allitems, setallitems] = useState([]);

  const [search, setsearch] = useState('');

  const [data, setdata] = useState([]);

  let image = require('../../assets/images/empty/img.png');
  let emptyText = search == '' ? 'Type to search product' : 'No product found!';

  useEffect(() => {
    matchData(search);
  }, [search]);

  useEffect(() => {
    setTimeout(() => {
      if (allcategory.length > 0) {
        let arr = [];
        allcategory.map((e, i, a) => {
          if (e.data.length > 0) {
            e.data.map((e, i, a) => {
              arr.push(e);
            });
          }
        });
        setallitems(arr);
      }
    }, 200);
  }, []);

  const matchData = txt => {
    console.log('txt : ', txt);
    if (txt == '') {
      setdata([]);
      return;
    } else {
      const dt = filter(allcategory, b => {
        return contains(b, txt);
      });

      if (dt.length > 0) {
        let arr = [];
        dt.map((e, i, a) => {
          if (e.data.length > 0) {
            e.data.map((r, i, a) => {
              arr.push(r);
            });
          }
        });
        setdata(arr);
        return;
      } else {
        const dt = filter(allitems, b => {
          return contains2(b, txt);
        });

        if (dt.length > 0) {
          let arr = [];
          dt.map((e, i, a) => {
            arr.push(e);
          });
          setdata(arr);
          return;
        } else {
          setdata([]);
          return;
        }
      }
    }
  };

  const goBack = () => {
    props.navigation.goBack();
  };

  const onPressEmail = () => {};

  const onPressPhone = () => {};

  const renderShowData = ({item, index}) => {
    return (
      <utils.FoodCard
        data={item}
        nav={props.navigation}
        search={true}
        screen="search"
      />
    );
  };

  const onChangeSearch = text => {
    const formattedQuery = text.toLowerCase();
    setsearch(formattedQuery);
  };

  const contains = ({title}, query) => {
    const s = query.toLowerCase();
    const sl = s.length;

    const sname = title.toLowerCase();
    const sn = sname.substr(0, sl);

    if (s == sn) {
      return true;
    }
    return false;
  };

  const contains2 = ({title}, query) => {
    if (title.toLowerCase().includes(query)) {
      return true;
    }
    return false;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent={false}
        backgroundColor={theme.color.background}
        barStyle={'dark-content'}
      />
      <View style={styles.header}>
        <View style={styles.back}>
          <TouchableOpacity activeOpacity={0.6} onPress={goBack}>
            <utils.vectorIcon.Ionicons
              name="chevron-back"
              color={theme.color.subTitle}
              size={26}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.htitle}>Search</Text>
      </View>

      <View style={{margin: 12}}>
        <Searchbar
          placeholder="Search product by name/category"
          placeholderTextColor={theme.color.subTitle}
          onChangeText={onChangeSearch}
          iconColor={theme.color.subTitle}
          inputStyle={{fontSize: 12, fontFamily: theme.fonts.fontNormal}}
          value={search}
          style={{
            height: responsiveHeight(5.5),
            backgroundColor: '#e6e6e6',
            elevation: 5,
          }}
        />
      </View>

      {data.length > 0 && search != '' ? (
        <FlatList
          contentContainerStyle={{
            paddingHorizontal: 12,
            paddingTop: 10,
            // paddingBottom: 125,
          }}
          showsVerticalScrollIndicator={false}
          data={data}
          keyboardDismissMode={'on-drag'}
          renderItem={renderShowData}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          removeClippedSubviews={true}
        />
      ) : (
        <Text style={styles.emptyText}>{emptyText}</Text>
      )}
    </SafeAreaView>
  );
}
