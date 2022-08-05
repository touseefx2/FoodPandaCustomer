import {StyleSheet} from 'react-native';
import theme from '../../theme/index';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.color.background,
  },
  logo: {
    width: responsiveWidth(80),
    height: responsiveHeight(50),
  },
  title: {
    fontSize: 30,
    fontFamily: theme.fonts.fontBold,
    color: theme.color.button1,
    alignSelf: 'center',
  },
});
