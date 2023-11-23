import React from 'react';
import {Dimensions, View} from 'react-native';
import IframeRenderer, {iframeModel} from '@native-html/iframe-plugin';
import RenderHTML from 'react-native-render-html';
import WebView from 'react-native-webview';

const renderers = {
  iframe: props => (
    <View renderToHardwareTextureAndroid={true}>
      <IframeRenderer {...props} />
    </View>
  ),
};

const customHTMLElementModels = {
  iframe: iframeModel,
};

const RenderDataHTML = React.memo(function RenderDataHTML({html, style = {}}) {
  
  return (
    <RenderHTML
      systemFonts={[
        'Poppins',
        'Poppins-ExtraLight',
        'Poppins-Light',
        'Poppins-Medium',
        'Poppins-SemiBold',
        'Poppins-Bold',
        'Poppins-ExtraBold',
      ]}
      source={{
        html: html || '',
      }}
      tagsStyles={{
        body: {
          fontFamily: 'Poppins-ExtraLight',
          fontSize: 13,
          color: '#000',
          fontWeight: '300',
          ...style,
        },
      }}
      enableExperimentalMarginCollapsing
      renderers={renderers}
      WebView={WebView}
      contentWidth={Dimensions.get('window').width - 32}
      customHTMLElementModels={customHTMLElementModels}
      renderersProps={{
        img: {
          enableExperimentalPercentWidth: true,
        },
      }}
    />
  );
});

export default RenderDataHTML;
