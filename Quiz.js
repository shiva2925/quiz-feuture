import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  BackHandler,
  DeviceEventEmitter,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { withTranslation } from 'react-i18next';
import ReviewQuiz from "./ReviewQuiz"
import IconI from 'react-native-vector-icons/Ionicons';
import IconF from 'react-native-vector-icons/Feather';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';

import Modal from 'react-native-modal';
// import { Images } from '../../../assets';
// import Accordion from 'react-native-collapsible/Accordion';
// import { Assignment } from 'app-component';
import { PostApi } from './Client';
import Toast from 'react-native-toast-message';
import styles from './QuizStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';

import RenderDataHTML from './render-data-html';
import ProgressCircle from "./Progress-cricles"

import CountDown from "./Countdowns";

class Quiz extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isShowMenu: false,
      pageActive: 0,
      data: null,
      activeSections: [],
      isLesson: false,
      isQuiz: false,
      isStartQuiz: false,
      dataQuiz: null,
      itemQuestion: null,
      isAssignment: false,
      isShowReview: false,
      retake_count:null, 
      routeData:{userId:"",sectionId:"",index:0}
    };
    this.item = null;
    this.id = null;
    this.type = null;
    this.idCourse = null;
    this.itemCheck = [];

    this.eventListener = null;
    // this.backHandler = null;
  }

  async componentDidMount() {
    var paramsData = window.location.pathname
    var params= paramsData.split("/")

    this.setState(this.routeData={userId:params[1],sectionId:params[2],index:Number(params[3])})

    const { item, index, idCourse } = {item:this.routeData.sectionId,index:1,idCourse:"5"};
    
    await this.getLesson();
    // await this.onStartQuiz()
    this.item = item;
    this.idCourse = idCourse;
    this.setState({
      activeSections: [index],
    });

    // this.setState({ question: questionTemp });
    this.eventListener = DeviceEventEmitter.addListener(
      'reloadDataRetake',
      this.onReloadDataRetake,
    );
    // this.backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.handleBackPress,
    // );
  }

  reloadFinish = async () => {
    await this.setState({
      isShowMenu: false,
      pageActive: 0,
      data: null,
      activeSections: [],
      isLesson: false,
      isQuiz: false,
      isStartQuiz: false,
      dataQuiz: null,
      itemQuestion: null,
      isAssignment: false,
    });
    /*const reqparams = {
      courseid: this.item.id
    }*/

    //const response = await Client.quiz(this.item.id);
    const sessiondetails = await AsyncStorage.getItem('userdata');
    // if (this.routeData.userId) {
      if (this.routeData.userId) {
      const userdata = JSON.parse(sessiondetails);
      // const response = await Client.quizStart(param);
      const response = await PostApi({ itemid: this.routeData.sectionId, userid: this.routeData.userId, status: 'started' }, 'GETQUIZ');

      this.setState({
        data: response.data,
        isLesson: false,
        isAssignment: false,
        isQuiz: true,
        dataQuiz: {
          ...response.data?.results,
          questions: response.data?.questions || {},
        },
      });
    }
  };

  componentWillUnmount() {
    // if (this.backHandler) {
    //   this.backHandler.remove();
    // }
    if (this.eventListener) {
      this.eventListener.remove();
    }
  }

  // handleBackPress = () => {
  //   const { navigation } = this.props;
  //   navigation.goBack(null);
  //   return true;
  // };

  // goBack = () => {
  //   const { navigation } = this.props;
  //   navigation.goBack();
  // };

  onReloadDataRetake = async data => {

    await this.setState({ isStartQuiz: false });
    // await this.getLesson(this.item);
    this.setState({
      isStartQuiz: true,
      dataQuiz: data.results,
      itemQuestion: data.results.questions[0],
    });
    // this.onStartQuiz();
  };

  getLesson = async () => {
    // if (this.id === item.id) return;

    const sessiondetails = await AsyncStorage.getItem('userdata');
    if (this.routeData.userId) {
      const userdata = JSON.parse(sessiondetails);
       //alert(item.type);
      //if (item.type === 'lp_quiz') {
        
        const response = await PostApi({ itemid: this.routeData.sectionId, userid: this.routeData.userId, status: 'started' }, 'GETQUIZ');
        // console.log(response.data?.results?.status, "check response")
        this.setState({
          data: response.data,
          isLesson: false,
          isAssignment: false,
          isQuiz: true,
          isStartQuiz: 'started' === 'started', 
          dataQuiz: {
            ...response.data?.results,
            questions: response.data?.questions || {},
          },
          itemQuestion: response.data?.questions[0],
          pageActive: 0,
        });
      //}
      
      console.log("176");
      
      this.id = this.routeData.sectionId;
      // dispatch(showLoading(false));
    }
  };

  openMenu = () => {
    this.setState({ isShowMenu: true });
  };

  selectQuestion(item) {
    const { itemQuestion } = this.state;

    if (itemQuestion.type === 'single_choice') {
      itemQuestion.answer = [item];
      this.forceUpdate();
    }
    if (itemQuestion.type === 'true_or_false') {
      itemQuestion.answer = item;
      console.log(itemQuestion);
      this.forceUpdate();
    }
    if (itemQuestion.type === 'multi_choice') {
      if (itemQuestion?.answer) {
        const temp = itemQuestion?.answer.find(x => x.value === item.value);
        if (temp) {
          itemQuestion.answer = itemQuestion.answer.filter(
            x => x.value !== item.value,
          );
          this.forceUpdate();
        } else {
          itemQuestion.answer = [...itemQuestion.answer, item];
          this.forceUpdate();
        }
      } else {
        itemQuestion.answer = [item];
        this.forceUpdate();
      }
    }
  }
  renderHeaderItem = ({ item, index }) => {
    const { pageActive } = this.state;
    // if (index > 5 && pageActive < 5)
    //   return <Text style={{ marginLeft: 3, marginTop: 3 }}>...</Text>;
    return (
      <TouchableOpacity
        onPress={() =>
          this.setState({
            pageActive: index,
            itemQuestion: item,
          })
        }
        style={[
          styles.btnPage,
          {
            backgroundColor: pageActive === index ? '#FBC815' : '#fff',
            borderColor: pageActive === index ? '#FBC815' : '#E4E4E4',
          },
        ]}>
        <Text style={styles.txtPage}>{index + 1}</Text>
      </TouchableOpacity>
    );
  };

  retakeandStartQuiz =async() =>{

    const sessiondetails = await AsyncStorage.getItem('userdata');
    if (this.routeData.userId) {
      const userdata = JSON.parse(sessiondetails);
      const param = {
        itemid: this.routeData.sectionId,
         userid: this.routeData.userId
      };

      const response = await PostApi(param, 'RETAKE');
      
      
      console.log(response,'RETAKE')

      if (response?.message === 'SUCCESS') {

  this.setState({
    data: response.data,
    dataQuiz: this.state.dataQuiz,
    retake_count: this.state.data?.meta_data?._lp_retake_count,
    idQuiz: this.state.data?.id,
  })
      }

      // if (response?.message === 'SUCCESS') {
      //   navigation.navigate('FinishLearningScreen', {
      //     data: response.data.data,
      //     dataQuiz,
      //     retake_count: this.state.data?.meta_data?._lp_retake_count,
      //     idQuiz: this.state.data?.id,
      //   });
      //   await this.onStartQuiz();
      // }
      await this.onStartQuiz();
    }

  }

  onStartQuiz = async () => {
    const { dispatch, t } = this.props;
    const { dataQuiz } = this.state;

    //dispatch(showLoading(true));

    const param = {
      id: this.id,
    };

    // Check if question is empty
    if (dataQuiz?.questions?.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'There are no questions for this course',
        position: 'top'
      });
      // Alert.alert('', t('learningScreen.quiz.noQuestion'));
      //dispatch(showLoading(false));
      return;
    }
    const sessiondetails = await AsyncStorage.getItem('userdata');
    if (this.routeData.userId) {
      const userdata = JSON.parse(sessiondetails);
      // const response = await Client.quizStart(param);
      const response = await PostApi({ itemid: this.routeData.sectionId, userid: this.routeData.userId, status: 'started' }, 'GETQUIZ');
      console.log(response, "check started response data");

      if (response.data?.status === 'success') {
      
        this.itemCheck = [];
        this.setState({
          isStartQuiz: true,
          dataQuiz: {
            ...response.data.results,
            instant_check: this.state.dataQuiz?.instant_check || false,
            checked_questions: [],
          },
          itemQuestion: response.data.results.questions[0],
         
        });
      } else {
        Alert.alert(response?.message);
      }
    }
    //dispatch(showLoading(false));
  };

  onPrevQuiz = () => {
    const { pageActive, dataQuiz } = this.state;
    this.flatListRef.scrollToIndex({
      index: pageActive - 1,
      animated: true,
    });
    this.setState({
      itemQuestion: dataQuiz.questions[pageActive - 1],
      pageActive: pageActive - 1,
    });
  };

  onNextQuiz = () => {
    const { t } = this.props;
    const { pageActive, dataQuiz } = this.state;

    if (dataQuiz.questions.length === pageActive + 1) {
      Alert.alert('', 'You have answered all your questions. You can review or hit the Finish button');
      return;
    }
    this.flatListRef.scrollToIndex({
      index: pageActive + 1,
      animated: true,
    });
    this.setState({
      itemQuestion: dataQuiz.questions[pageActive + 1],
      pageActive: pageActive + 1,
    });
  };

  onFinish = async () => {
    const { dispatch, route } = this.props;
    const { dataQuiz } = this.state;
    //dispatch(showLoading(true));
    const itemTemp = new Object();
    const itemTemp1 = [];
    //tronLog('dataQuiz.questions', dataQuiz.questions);
    dataQuiz.questions.forEach(x => {
      if (this.itemCheck.find(y => y.id === x.id)) {
        return;
      }
      if (x.type === 'sorting_choice') {
        itemTemp[String(x.id)] = x.options.map(y => y.value);
      } else if (x?.answer) {
        if (x.type === 'true_or_false') {
          const answers = {
            questionid: x.id,
            answer: x.answer.value
          }
          itemTemp[String(x.id)] = x.answer.value;
          itemTemp1.push(answers);
        } else if (x.type === 'fill_in_blanks') {
          itemTemp[String(x.id)] = x.answer;
          /* const answers={
             questionid :x.id,
             answer:x.answer
            }
           itemTemp[String(x.id)] = x.answer;
           itemTemp1.push(answers);*/


        } else if (x.type === 'multi_choice') {
          itemTemp[String(x.id)] = x.answer.map(y => y.value);

          const answers = {
            questionid: x.id,
            answer: x.answer.map(y => y.value)
          }
          itemTemp1.push(answers);
        } else {
          itemTemp[String(x.id)] = x.answer.map(y => y.value);

          const answers = {
            questionid: x.id,
            answer: x.answer.map(y => y.value)
          }
          itemTemp1.push(answers);
        }
      }
    });


    ;
    const sessiondetails = await AsyncStorage.getItem('userdata');
    // if (this.routeData.userId) {
      if (this.routeData.userId) {
      const userdata = JSON.parse(sessiondetails);
      const param = {
        // itemid: this.routeData.sectionId,
        itemid: this.routeData.sectionId,
        answered: itemTemp1,
        userid: this.routeData.userId
      };
console.log(param, itemTemp,"chheck params and tmp id")
      const response = await PostApi(param, 'FINISHQUIZ');
      if (response?.data) {
        this.setState({
          data: response.data,
          isQuiz: true,
          isStartQuiz: false, 
          dataQuiz,
          retake_count: this.state.data?.meta_data?._lp_retake_count,
          idQuiz: this.state.data?.id,
        });
        // });
        // await this.reloadFinish();
      }
      
      // if (response?.data === 'success') {
      //   navigation.navigate('FinishLearningScreen', {
      //     data: response.results,
      //     dataQuiz,
      //     retake_count: this.state.data?.meta_data?._lp_retake_count,
      //     idQuiz: this.state.data?.id,
      //   });
      //   // await this.reloadFinish();
      // }

    }
    //dispatch(showLoading(false));
  };

  showHint = () => {
    const { t } = this.props;
    const { itemQuestion } = this.state;
    // tronLog('itemQuestion', itemQuestion);
    if (itemQuestion?.hint) {
      alert('Hint', itemQuestion.hint);
    } else {
      alert('Hint is empty');
    }
  };


  renderFillInBlanks = () => {
    const { itemQuestion, dataQuiz } = this.state;
    const lstIdKeys = [];
    const { ids, title_api } = itemQuestion.options[0];
    ids.forEach(id => {
      lstIdKeys.push({ id, key: `{{FIB_${id}}}` });
    });
    const item = itemQuestion.options[0];

    const words = title_api.split(' ');
    return words.map((i, k) => {
      const itemKey = lstIdKeys.find(x => x.key === i);
      if (itemKey) {
        if (
          this.itemCheck.find(x => x.id === itemQuestion.id) ||
          (dataQuiz?.checked_questions &&
            dataQuiz?.checked_questions.includes(itemQuestion.id))
        ) {
          return (
            <View
              key={String(k)}
              style={{
                minWidth: 60,
                paddingVertical: 2,
                paddingHorizontal: 5,
                backgroundColor: '#ECECEC',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              {!item.answers[itemKey.id]?.is_correct && (
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: '#000000',
                  }}>
                  {item.answers[itemKey.id]?.answer || ''}
                </Text>
              )}
              {!item.answers[itemKey.id]?.is_correct &&
                item.answers[itemKey.id]?.correct && (
                  <IconF name="arrow-right" color="#666" size={14} />
                )}
              <Text
                style={{
                  fontWeight: 'bold',
                  color: '#36CE61',
                }}>
                {item.answers[itemKey.id]?.correct
                  ? `${item.answers[itemKey.id]?.correct}`
                  : ''}
              </Text>
            </View>
          );
        }
        return (
          <TextInput
            key={String(k)}
            disabled={!!this.itemCheck.find(x => x.id === itemQuestion.id)}
            style={{
              marginVertical: 0,
              paddingVertical: 0,
              marginBottom: 5,
              // height: 20,
              minWidth: 60,
              borderBottomWidth: 1,
              color: '#000',
            }}
            underlineColorAndroid="undefined"
            onChangeText={value => this.onChangeFillBlank(itemKey.id, value)}
          />
        );
      }
      return <Text key={String(k)}> {i} </Text>;
    });
  };

  onChangeFillBlank = (id, value) => {
    const { itemQuestion } = this.state;
    if (itemQuestion.answer !== undefined) {
      if (itemQuestion?.answer[id] === value) {
        itemQuestion.answer[id] = value;
      } else {
        itemQuestion.answer[id] = value;
      }
    } else {
      itemQuestion.answer = new Object();
      itemQuestion.answer[id] = value;
    }
  };

  callBackFinishQuiz = () => {
    this.onFinish();
  };

  onCheck = async () => {
    const { t, dispatch } = this.props;
    const { itemQuestion } = this.state;

    

    if (!itemQuestion?.answer && itemQuestion.type !== 'sorting_choice') {
     alert('Please answer questions first');
      return;
    }

    // dispatch(showLoading(true));
    const itemTemp = new Object();

    if (itemQuestion.type === 'sorting_choice') {
      itemTemp.value = itemQuestion.options.map(y => y.value);
    } else if (itemQuestion?.answer) {
      if (itemQuestion.type === 'true_or_false') {
        itemTemp.value = itemQuestion.answer.value;
      } else if (itemQuestion.type === 'fill_in_blanks') {
        itemTemp.value = itemQuestion.answer;
      } else if (itemQuestion.type === 'multi_choice') {
        itemTemp.value = itemQuestion.answer.map(y => y.value);
      } else {
        itemTemp.value = itemQuestion.answer.map(y => y.value);
      }
    }
    const sessiondetails = await AsyncStorage.getItem('userdata');
  
    if (this.routeData.userId) {

      const userdata = JSON.parse(sessiondetails);
    
      const param = {
        id: this.routeData.sectionId,
        question_id: itemQuestion.id,
        answered: itemTemp.value,
        userid: this.routeData.userId
      };
      const response = await PostApi(param, 'CHECKANSWER');
      if (response.code === 'cannot_check_answer') {
        Alert.alert(response.message);
      }

      const dataTemp = {
        id: itemQuestion.id,
        result: response.data.result,
        explanation: response?.explanation || null,
      };
      if (response?.options) {
        const newItemQuestion = { ...itemQuestion };
        newItemQuestion.options = response.options;
        this.setState({ itemQuestion: newItemQuestion });
      }
      console.log(dataTemp, "dataTemp")
      this.itemCheck.push(dataTemp);
      this.forceUpdate();
      // this.dispatch(showLoading(false));
    }

   
  };

  isDisable = (itemCheck, itemQuestion) => {
    const { dataQuiz } = this.state;

    if (
      itemCheck.find(x => x.id === itemQuestion.id) ||
      (dataQuiz?.checked_questions &&
        dataQuiz?.checked_questions.includes(itemQuestion.id))
    ) {
      return true;
    }
    return false;
  }

  onFinishCourse =() =>{
    console.log(this.item);
    const { route } = this.props;

    Alert.alert(
      //title
      'Confirmation',
      //body
      'Are you sure you want to finishitemQuestion the Assessment section ?',
      [
        
          {
              text: "Cancel",
              onPress: () =>{ 
               
               },
              style: "cancel"
            },
            {
              text: "OK",
              onPress: async() => {
               // console.log("OK Pressed, password: " + couponcode)

               const reqdata ={
                  sectionid:this.item.sectionid,
                  itemid:this.item.id,
                  userid:''
              }
      
              const saveResponse = await PostApi(reqdata,'FINISHITEM');
              if(saveResponse?.data?.id){
                  Toast.show({
                      type: 'success',
                      text1: 'Completed successfully',
                      position: 'top'
                    });
                    DeviceEventEmitter.emit('itemfinishedsuccess2', route?.params?.idCourse);
              }else{
                  Toast.show({
                      type: 'success',
                      text1: 'Failed to completed',
                      position: 'top'
                    }); 
              }
               
              }
            }
      ],
      { cancelable: false }
      //clicking out side of alert will not cancel
    );
  }


  render() {
    const { t, course, navigation } = this.props;

    const {
      isShowMenu,
      data,
      activeSections,
      isLesson,
      isQuiz,
      isStartQuiz,
      dataQuiz,
      itemQuestion,
      pageActive,
      isAssignment,
    } = this.state;


    return (
      <View style={styles.container}>

        {/* <Image source={Images.bannerMyCourse} style={styles.imgBanner} /> */}
        <View style={styles.header}>
          <View style={styles.header1}>
            <TouchableOpacity
              onPress={this.openMenu}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              {/* <Image source={Images.iconMenu} style={styles.iconMenu} /> */}
            </TouchableOpacity>
            <Text style={styles.childTitle} />
            <TouchableOpacity
              onPress={this.goBack}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              {/* <Image source={Images.iconClose} style={styles.iconBack} /> */}
            </TouchableOpacity>
          </View>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView
            ref={refs => {
              this.scrollView = refs;
            }}
            scrollEnabled={this.state.scrollenabled}
            style={styles.content}
            contentContainerStyle={{ paddingBottom: 50 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
            overScrollMode="never"
            removeClippedSubviews>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>

              {isQuiz && !isStartQuiz && data?.results?.status === '' && (
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <IconF name="clock" size={14} />
                    <Text style={[styles.txtTime, { marginLeft: 4 }]}>
                      {data?.duration}
                    </Text>
                  </View>

                  <Text style={[styles.title, { marginVertical: 10 }]}>
                    {data?.name}
                  </Text>
                  <Text style={styles.txtLession}>
                    Questions: {data?.questions.length}

                  </Text>
                  <Text style={styles.txtLession}>
                    Passing grade:{data?.meta_data._lp_passing_grade}

                  </Text>
                  <RenderDataHTML html={data?.content || ''} />
                  <TouchableOpacity
                    style={[styles.btnFinish, { marginTop: 10 }]}
                    onPress={this.onStartQuiz}>
                    <Text style={styles.txtFinish}>
                      Start
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
             

             
              {isQuiz && !isStartQuiz && data?.results?.status !== '' && (
             
                <View>
                   
                
                  <View>
                    <View style={styles.overview}>
                   
                      <ProgressCircle
                        widthX={110}
                        progress={
                         Math.round(data.result) / 100
                        } 
                        strokeWidth={10}
                        backgroundColor="#F6F6F6"
                        progressColor={
                          // data?.results?.results?.graduation === 'failed'
                          data?.graduation === 'failed'
                            ? '#F46647'
                            : '#58C3FF'
                        }
                        textStyle={styles.txtCircle}
                      />
                      <View style={{ marginLeft: 24 }}>
                        <Text style={styles.txtLable}>
                          Your Result
                        </Text>
                        <Text
                          style={[
                            styles.txtResult,
                            // data?.results?.results?.graduation !== 'failed' && {
                            data?.graduation !== 'failed' && {
                              color: '#58C3FF',
                            },
                          ]}>
                          {/* {data?.results?.results?.graduationText} */}
                          {data?.graduationText}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ marginTop: 25 }}>
                    {data?.results?.results?.graduation === 'failed' && (
                      <Text style={styles.txt3}>
                        {/*{t('learningScreen.quiz.result.failed', {
                          result: Math.round(data?.results?.results?.result),
                          grade: data?.results.results?.passing_grade,
                        })}*/}

                        {/* Your quiz assessment failed The result is {Math.round(data?.results?.results?.result)} % (the requirement is {data?.results.results?.passing_grade}) */}

                        Your quiz assessment failed The result is {Math.round(data?.result)} % (the requirement is {data?.passing_grade})
                      </Text>
                    )}

                    <View style={styles.viewQuestion1}>
                      <Text style={styles.txt2}>
                        Questions
                      </Text>
                      <Text style={styles.txt2}>
                        {/* {data?.results.results?.question_count} */}
                        {data?.question_count}
                      </Text>
                    </View>
                    <View style={styles.viewQuestion1}>
                      <Text style={styles.txt2}>
                        Correct
                      </Text>
                      <Text style={styles.txt2}>
                        {/* {data?.results.results?.question_correct} */}
                        {data?.question_correct}
                      </Text>
                    </View>
                    <View style={styles.viewQuestion1}>
                      <Text style={styles.txt2}>
                        Wrong
                      </Text>
                      <Text style={styles.txt2}>
                        {/* {data?.results.results?.question_wrong} */}
                        {data?.question_wrong}
                      </Text>
                    </View>
                    <View style={styles.viewQuestion1}>
                      <Text style={styles.txt2}>
                        Skipped
                      </Text>
                      <Text style={styles.txt2}>
                        {/* {data?.results.results?.question_empty} */}
                        {data?.question_empty}
                      </Text>
                    </View>
                    <View style={styles.viewQuestion1}>
                      <Text style={styles.txt2}>
                        Points
                      </Text>
                      <Text style={styles.txt2}>
                        {/* {data?.results.results?.user_mark} */}
                        {data?.user_mark}
                      </Text>
                    </View>
                    {/* <View style={styles.viewQuestion1}>
                      <Text style={styles.txt2}>
                        Timespent
                      </Text>
                      <Text style={styles.txt2}>
                        {/* {data?.results.results?.time_spend} 
                        {data?.time_spend}
                      </Text>
                    </View> */}
                  </View>
                  <View style={styles.viewBottom}>
                 
                    {(this.state.retake_count == -1 ||
                      this.state.retake_count - data.retaken >
                      0) && (
                        <TouchableOpacity
                        
                          style={styles.btnRetoke}
                          onPress={() => this.retakeandStartQuiz()}>
                          <Text style={styles.txtRetoke}>
                            Retake
                            {console.log("i am inside retake")}
                          </Text>
                          {/* <Text style={styles.txtRetoke}>
                          {'Retake {count}', {
                            count:
                              data?.results?.retake_count == -1
                                ? t(
                                    'learningScreen.quiz.result.btnRetakeUnlimited',
                                  )
                                : data?.results?.retake_count -
                                  data.results.retaken,
                          })}
                        </Text>*/}
                        </TouchableOpacity>
                      )}
                    <TouchableOpacity
                      style={styles.btnReview}
                      onPress={() => {
                        this.setState({ isShowReview: true });
                      }}>
                      <Text style={styles.txtReview}>
                        Review
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {isStartQuiz && isQuiz && (
              
              <View style={{ marginTop: 20 }}>
                
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    numberOfLines={1}
                    style={[styles.title, { flex: 1, paddingRight: 10 }]}>
                    {data?.name}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <CountDown
                      duration={dataQuiz?.duration}
                      callBack={this.callBackFinishQuiz}
                      textStyle={{
                        color: 'red',
                        fontSize: 12,
                        fontFamily: 'Poppins-Medium',
                      }}
                    />
                    <Text
                      numberOfLines={1}
                      style={{
                        color: 'red',
                        fontFamily: 'Poppins',
                        fontSize: 12,
                      }}>
                      {' '}
                      Remaining
                    </Text>
                  </View>
                </View>
                {dataQuiz.questions.length > 1 && (
                  <View style={styles.viewPage}>
                    <TouchableOpacity
                      style={styles.btnPage}
                      onPress={this.onPrevQuiz}
                      disabled={pageActive === 0 ? true : false}>
                      <IconI name="chevron-back-outline" />
                    </TouchableOpacity>
                    <FlatList
                      ref={ref => {
                        this.flatListRef = ref;
                      }}
                      data={dataQuiz.questions}
                      horizontal
                      style={styles.flatPage}
                      contentContainerStyle={styles.flatPageContainer}
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={(item, index) => String(index)}
                      renderItem={({ item, index }) =>
                        this.renderHeaderItem({ item, index })
                      }
                    />
                    <TouchableOpacity
                      style={styles.btnPage}
                      onPress={this.onNextQuiz}>
                      <IconI name="chevron-forward-outline" />
                    </TouchableOpacity>
                  </View>
                )}
                {/* phần câu hỏi */}
                {itemQuestion && (
                  <View style={styles.viewQuestion}>


                    <RenderDataHTML
                      html={itemQuestion?.title}
                      style={styles.txtTitleQuestion}
                    />
                    {itemQuestion?.content && (
                      <RenderDataHTML html={itemQuestion?.content} />
                    )}
                    {itemQuestion.type === 'single_choice' &&
                      itemQuestion.options.map((item, i) => (
                        <TouchableOpacity
                          key={String(i)}
                          style={styles.itemQuestion}
                          onPress={() => this.selectQuestion(item)}
                          disabled={this.isDisable(
                            this.itemCheck,
                            itemQuestion,
                          )}>
                          <IconI
                            name={
                              itemQuestion?.answer &&
                                itemQuestion.answer.find(
                                  x => x.value === item.value,
                                )
                                ? 'radio-button-on'
                                : 'radio-button-off'
                            }
                            size={14}
                            color="#878787"
                          />
                          {/*<Text style={styles.txtItemQuestion}>
                            {item.title}
                          </Text>*/}
                          <RenderDataHTML
                            html={item?.title}
                            style={styles.txtItemQuestion}
                          />
                        </TouchableOpacity>
                      ))}
                    {itemQuestion.type === 'true_or_false' &&
                      itemQuestion.options.map((item, i) => (
                        <TouchableOpacity
                          key={String(i)}
                          style={styles.itemQuestion}
                          onPress={() => this.selectQuestion(item)}
                          disabled={this.isDisable(this.itemCheck,itemQuestion)}>
                          <IconI
                            name={
                              itemQuestion?.answer &&
                                itemQuestion.answer.value === item.value
                                ? 'radio-button-on'
                                : 'radio-button-off'
                            }
                            size={14}
                            color="#878787"
                          />
                          <Text style={styles.txtItemQuestion}>
                            <RenderDataHTML
                              html={item?.title}
                              style={styles.txtItemQuestion}
                            />
                          </Text>
                        </TouchableOpacity>
                      ))}

                    {itemQuestion.type === 'multi_choice' &&
                      itemQuestion.options.map((item, i) => (
                        <TouchableOpacity
                          key={String(i)}
                          style={styles.itemQuestion}
                          disabled={this.isDisable(
                            this.itemCheck,
                            itemQuestion,
                          )}
                          onPress={() => this.selectQuestion(item)}>
                          <IconI
                            name={
                              itemQuestion?.answer &&
                                itemQuestion.answer.find(
                                  x => x.value === item.value,
                                )
                                ? 'ios-checkbox-outline'
                                : 'square-outline'
                            }
                            size={14}
                            color="#878787"
                          />
                          <Text style={styles.txtItemQuestion}>
                            <RenderDataHTML
                              html={item?.title}
                              style={styles.txtItemQuestion}
                            />
                          </Text>
                        </TouchableOpacity>
                      ))}
                    { /* { itemQuestion.type === 'sorting_choice' && (
                      <DraggableFlatList
                        onDragBegin={() => {
                          this.setState({scrollenabled: false});
                        }}
                        onRelease={() => {
                          this.setState({scrollenabled: true});
                        }}
                        onDragEnd={({data}) => {
                          itemQuestion.options = data;
                          this.forceUpdate();
                        }}
                        keyExtractor={item => `draggable-item-${item.value}`}
                        data={itemQuestion.options}
                        renderItem={({item, drag, isActive}) => (
                          <TouchableOpacity
                            style={{
                              padding: 8,
                              borderColor: '#F3F3F3',
                              borderWidth: 1,
                              borderRadius: 6,
                              alignItems: 'center',

                              // justifyContent: 'center',
                              flexDirection: 'row',
                              // marginHorizontal: 16,
                              marginBottom: 12,
                              backgroundColor: isActive ? '#F3F3F3' : '#fff',
                            }}
                            disabled={this.isDisable(
                              this.itemCheck,
                              itemQuestion,
                            )}
                            onLongPress={drag}>
                            <IconI
                              name="menu"
                              size={22}
                              color="#000"
                              style={{marginRight: 10}}
                            />
                            <Text style={styles.txtItemQuestion}>
                              {item.title}
                            </Text>
                          </TouchableOpacity>
                        )}
                      />
                            )}*/}
                    {itemQuestion.type === 'fill_in_blanks' && (
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {this.renderFillInBlanks()}
                      </View>
                    )}
                  </View>
                )}
                {this.itemCheck.find(x => x.id === itemQuestion.id) && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 30,
                    }}>
                      
                    {this.itemCheck.find(x => x.id === itemQuestion.id)?.result
                      ?.correct ? (
                      <View
                        style={{
                          paddingHorizontal: 8,
                          paddingVertical: 6,
                          backgroundColor: '#58C3FF',
                          alignSelf: 'flex-start',
                          borderRadius: 4,
                        }}>
                        <Text style={{ color: '#fff' }}>
                          Correct
                        </Text>
                      </View>
                    ) : (
                      <View
                        style={{
                          paddingHorizontal: 8,
                          paddingVertical: 6,
                          backgroundColor: '#F46647',
                          alignSelf: 'flex-start',
                          borderRadius: 4,
                        }}>
                        <Text style={{ color: '#fff' }}>
                          Incorrect
                        </Text>
                      </View>
                    )}
                    <View
                      style={{
                        marginLeft: 16,
                        padding: 8,
                        alignSelf: 'flex-start',
                      }}>
                      <Text>
                        {/* {t('learningScreen.quiz.point', {
                          point: this.itemCheck.find(
                            x => x.id === itemQuestion.id,
                          )?.result?.mark,
                        })}*/}
                        Point :{this.itemCheck.find(
                          x => x.id === itemQuestion.id,
                        )?.result?.mark}
                      </Text>
                    </View>
                    {this.itemCheck.find(x => x.id === itemQuestion.id)
                      ?.explanation && (
                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginLeft: 16,
                            padding: 0,
                            alignSelf: 'flex-start',
                            borderBottomWidth: 2,
                            borderBottomColor: '#b334af',
                          }}
                          onPress={() =>
                            Alert.alert(
                              'Explanation',
                              this.itemCheck.find(x => x.id === itemQuestion.id)
                                .explanation,
                            )
                          }>
                          <IconF name="navigation" color="#b334af" size={14} />
                          <Text
                            style={{
                              color: '#b334af',
                              marginLeft: 5,
                              fontFamily: 'Poppins-Medium',
                            }}>
                            Explanation
                          </Text>
                        </TouchableOpacity>
                      )}
                  </View>
                )}
                <View style={{ height: 36 }} />
                {/* {dataQuiz?.instant_check &&
                  (!dataQuiz?.checked_questions?.length ||
                    !dataQuiz?.checked_questions.includes(itemQuestion.id)) && (
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#36CE61',
                        borderRadius: 6,
                        justifyContent: 'center',
                        height: 50,
                      }}
                      disabled={
                        !!this.itemCheck.find(x => x.id === itemQuestion.id)
                      }
                      onPress={() => this.onCheck()}>
                      <Text style={{ color: '#fff' }}>
                        Check answer
                      </Text>
                      {console.log("i am in checked ")}
                      <IconI name="checkmark" color="#fff" />
                    </TouchableOpacity>
                  )} */}

                {dataQuiz?.instant_check &&
                  dataQuiz?.checked_questions &&
                  dataQuiz?.checked_questions.includes(itemQuestion.id) && (
                    
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 50,
                      }}>
                      <Text style={{ color: '#36CE61' }}>
                        Question answered
                      </Text>
                      <IconI name="checkmark" color="#36CE61" />
                    </View>
                  )}
                <View style={styles.viewBtnBottom}>
                  <TouchableOpacity
                    style={styles.btnHint}
                    onPress={this.showHint}>
                    <IconM name="lightbulb-on-outline" size={20} color="#fff" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnSubmit}
                    onPress={this.onFinish}>
                    <Text style={styles.txtBtnSubmit}>
                      Finish
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.btnNext}
                    onPress={this.onNextQuiz}>
                    {/* <Image source={Images.iconNext} style={styles.iconNext} /> */}
                    <IconM name="arrow-right" size={20}  />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {data?.can_finish_course && isQuiz && (
              <View
                style={{
                  paddingBottom: 30,
                  paddingHorizontal: 30,
                  backgroundColor: '#fff',
                  marginTop: 30,
                }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: '#222',
                    borderRadius: 6,
                    paddingHorizontal: 21,
                    paddingVertical: 10,
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={this.onFinishCourse}>
                  <Text style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 14,
                    lineHeight: 21,
                    color: '#fff',
                    fontWeight: '500',
                  }}>
                    Finish Section
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>


   {this.state.isShowReview && data && (
    // console.log(data, "i am data")
          <ReviewQuiz
            data={data}
            isShowReview={this.state.isShowReview}
            onClose={() => this.setState({ isShowReview: false })}
          />
        )} 


      </View>


    );


  }



}

export default withTranslation()(Quiz);