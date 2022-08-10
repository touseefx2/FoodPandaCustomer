import {Platform, StyleSheet} from 'react-native';
import theme from '../../theme/index';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.button1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  background: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
  },
  title1: {
    fontSize: 34,
    fontFamily: theme.fonts.fontMedium,
    color: 'white',
    alignSelf: 'center',
  },
  title2: {
    marginTop: 15,
    fontSize: 30,
    fontFamily: theme.fonts.fontBold,
    color: 'white',
    alignSelf: 'center',
  },
});
