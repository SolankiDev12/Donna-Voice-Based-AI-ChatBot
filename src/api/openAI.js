import axios from 'axios';
const {apiKey} = require("../constants");

const client =  axios.create({
    headers:{
        "Authorization":"Bearer "+apiKey,
        "content-Type":"application/json"
    }
})

const chatGptEndpoint = 'https://api.openai.com/v1/chat/completions' 
const dalleEndpoint = 'https://api.openai.com/v1/images/generations'

export const apiCall = async(prompt, messages)=>{
    try{
            const res = await client.post(chatGptEndpoint,{
                model:'gpt-3.5-turbo-1106',
                messages:[{
                    role:'user',
                    content:`Does this message want to generate an AI picture, image, art or anything similar? ${prompt} . Simply answer with a yes or no.`
                }]
            })

            console.log('data: ',res.data.choices[0].message);
            let isArt = res.data?.choices[0]?.message?.content;

            if(isArt.toLowerCase().includes('yes')){
                    console.log('dalle api call'); 
                    return dalleApicall(prompt,messages || []);
            }else{
                console.log('chatgpt api call');
                return chatgptApicall(prompt,messages || []);
            }
    }catch(err)
    {
        console.log('error: ',err)
        return Promise.resolve({success: false, msg: err.message});
    }
}

const chatgptApicall = async (prompt, messages)=>{
    try{
        const res = await client.post(chatGptEndpoint,{
            model:'gpt-3.5-turbo-1106',
            messages
        });

        let answer = res.data?.choices[0]?.message?.content;
        messages.push({role:'assistant',content: answer.trim()});
        return Promise.resolve({success:true, data:messages});

    }catch(err)
    {
        console.log('error',err);
        return Promise.resolve({success: false,msg : err.message});
    }
}

const dalleApicall =  async (prompt, messages)=>{
    try{
        const res = await client.post(dalleEndpoint,{
            prompt,
            n: 1,
            size: "512x512"
        });

        let url = res?.data?.data[0]?.url;
        console.log('got url of image: ',url);
        messages.push({role:'assistant',content: url});
        return Promise.resolve({success: true, data:messages});

    }catch(err)
    {
        console.log('error',err);
        return Promise.resolve({success: false,msg : err.message});
    }

}