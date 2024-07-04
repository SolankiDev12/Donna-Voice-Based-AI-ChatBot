import { View,Text, SafeAreaView, Image, ScrollView, Touchable, TouchableOpacity, Alert, Animated } from "react-native";
import React, { useEffect, useRef, useState }  from "react";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Features from "../components/Features";
import { dummyMessages } from "../constants";
import Voice from '@react-native-community/voice';
import { apiCall } from "../api/openAI";
import Tts from 'react-native-tts';

export default function HomeScreen() {
  const[messages, setMessages] = useState([]);
  const[recording, setRecording] = useState(false);
  const[speaking, setSpeaking] = useState(false);
  const[result,setResult] = useState('');
  const[loading,setLoading] = useState(false);
  const ScrollViewRef =   useRef();
 
  const speechStartHandler = e=>{
      console.log('speech start handler');
  }
  const speechEndHandler = e=>{
    setRecording(false);
      console.log('speech End handler');
  }
  const speechResultsHandler = e=>{
      console.log('Voice event:',e);
      const text = e.value[0];
      setResult(text);
  }
  const speechErrorHandler = e=>{
      console.log('speech error handler',e);
  }

  const startRecording = async ()=>{
    setRecording(true);
    Tts.stop();
    try{
      await Voice.start('en-GB'); //en-US
    }catch(error){
      console.log('error: ',error);
    }
  }
  const stopRecording = async ()=>{
    try{
      await Voice.stop(); 
      setRecording(false);
      //fetch response
      fetchResponse();
    }catch(error){
      console.log('error: ',error);
    }
  }

  const fetchResponse = ()=>{
    if(result.trim().length>0)
      {
          let newMessages = [...messages];
          newMessages.push({role:'user',content:result.trim()});
          setMessages([...newMessages]);
          udpdateScrollView();
          setLoading(true);
          apiCall(result.trim(),newMessages).then(res=>{
            setLoading(false);
            console.log('got api data: ',res);
              if(res.success){
              setMessages([...res.data]);
              udpdateScrollView();
              setResult('');
              startTextToSpeech(res.data[res.data.length-1]);
             }else{
              Alert.alert('Error',res.msg);
             }
          })
      } 
  }

  const startTextToSpeech = message =>{
    if(!message.content.includes('https'))
      {
        setSpeaking(true);
        Tts.speak(message.content, {
          androidParams: {
            KEY_PARAM_PAN: -1,
            KEY_PARAM_VOLUME: 0.5,
            KEY_PARAM_STREAM: 'STREAM_MUSIC',
          },
        });
      }
  }

  const udpdateScrollView = ()=>
    {
      setTimeout(()=>{
        ScrollViewRef?.current?.scrollToEnd({animated:true}); 
      },200)
    }

  const clear = ()=>{
    setMessages([]);
    Tts.stop();
  }

  const stopSpeaking = ()=>{
    Tts.stop();
    setSpeaking(false);
  }

  useEffect(()=>{
    //voice handler events
    Voice.onSpeechStart = speechStartHandler;
    Voice.onSpeechEnd = speechEndHandler;
    Voice.onSpeechResults = speechResultsHandler;
    Voice.onSpeechError = speechErrorHandler;

    //tts handler
    Tts.addEventListener('tts-start', (event) => console.log("start", event));
    Tts.addEventListener('tts-progress', (event) => console.log("progress", event));
    Tts.addEventListener('tts-finish', (event) =>{console.log("finish", event); setSpeaking(false)});
    Tts.addEventListener('tts-cancel', (event) => console.log("cancel", event));
      

    return ()=>{
        Voice.destroy().then(Voice.removeAllListeners); 
    }
  },[])

  // console.log('results',result);

  return(
    <View className='flex-1 bg-white'>
      <SafeAreaView className="flex-1 flex mx-5 mt-5" >
      {/* bot icon  */}
      <View className="flex-row justify-center">
        <Image source={require('../../assets/images/bot_gif.gif')} style={{height: hp(15), width:hp(15)}}></Image>
      </View>

      {/* features || messages */}
      {
        messages.length>0?
       ( 
       <View className="space-y-2 flex-1">
          <Text style={{fontSize:wp(7)}} className="text-gray-700 font-semibold ml-1">Assitant</Text>
        <View 
          style={{height:hp(58)}}
          className="bg-neutral-200 rounded-3xl p-4"
        >
          <ScrollView
            ref={ScrollViewRef}
            bounces={false}
            className="space-y-4"
            showsVerticalScrollIndicator={false}
          >  
          {
            messages.map((message,index)=>{
              if(message.role=='assistant')
                {
                  if(message.content.includes('https'))
                    {
                      //its a ai img
                      return(
                      <View key={index} className="flex-row justify-start">
                        <View className="p-2 flex rounded-2xl bg-sky-300 rounded-tl-none">
                          <Image
                            source={{uri: message.content}}
                            className="rounded-2xl"
                            resizeMode="contain"
                            style={{height:wp(60),width:wp(60)}}
                          ></Image>
                        </View>
                      </View> 
                      )
                    }else
                    {
                      //txt msg
                      return(
                          <View 
                              key={index}
                              style={{width:wp(70)}}
                              className="bg-sky-300 rounded-xl p-2 rounded-tl-none"
                          >
                          <Text style={{color:'black'}}>{message.content}</Text>
                          </View>
                          )
                    }
                }else
                {
                    //user input
                    return(
                      <View key={index} className="flex-row justify-end">
                          <View 
                          style={{width:wp(70)}}
                          className="bg-white rounded-xl p-2 rounded-tr-none"
                          >
                            <Text style={{color:'black'}}>{message.content}</Text>
                          </View>
                      </View>
                    )
                }
            })

          }
          </ScrollView>
        </View>
        </View>
       ):(
            <Features/>
         )
      }

      {/* recoding ,clear ,stop */}
      <View className="flex justify-center items-center mb-5">
        {
          loading?( <Image
            source={require('../../assets/images/Twirl.gif')}
            style={{width:hp(8),height:hp(8)}}/>
            ):
          recording ?(
            <TouchableOpacity onPress={stopRecording}>
              {/* recording stop btn */}
            <Image
                className="rounded-full"
                source={require('../../assets/images/Twirl.gif')}
                style={{width:hp(8),height:hp(8)}}
            />
          </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={startRecording}>
              {/* recording start btn */}
            <Image
                className="rounded-full"
                source={require('../../assets/images/mic.png')}
                style={{width:hp(8),height:hp(8)}}
            />
          </TouchableOpacity>
          )
        }

        {
          messages.length>0 && (
            <TouchableOpacity
              onPress={clear}
              className="bg-neutral-400 rounded-3xl p-3 absolute right-8"
            >
              <Text className="text-white font-semibold" >Clear</Text>
            </TouchableOpacity>
          )
        }
        {
          speaking && (
            <TouchableOpacity
              onPress={stopSpeaking}
              className="bg-red-400 rounded-3xl p-3 absolute left-8"
            >
              <Text className="text-white font-semibold" >Stop</Text>
            </TouchableOpacity>
          )
        }
      </View>
      </SafeAreaView>
    </View>
  )
}