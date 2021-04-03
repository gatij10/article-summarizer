from nltk.corpus import stopwords
from collections import defaultdict
import string
import heapq
import spacy
import neuralcoref
import nltk
from nltk.tokenize import word_tokenize,sent_tokenize

import pickle
import numpy as np

import urllib.request
import fitz

from bson.json_util import dumps

from flask_pymongo import pymongo

from flask import Flask, jsonify, request
from flask_cors import CORS


nlp=spacy.load("en_core_web_md")

#graph summarizer - summarizer 1
neuralcoref.add_to_pipe(nlp)

def tokenizer(text):
    sentence,word_sent=[],[]
    stopWords=set(stopwords.words("english"))
    doc=nlp(text)
    for sent in doc.sents:
        sentence.append(sent)
        words=[]
        for token in sent :
            if token.text not in stopWords or token.text not in string.punctuation:
                if token.pos_=="PRON" and token._.in_coref:
                    for cluster in token._.coref_clusters:
                        words.append((cluster.main.text,"NOUN"))
                if token.pos_=="NOUN" or token.pos_=="PROPN":
                    words.append((token.text,token.pos_))
        word_sent.append(words)
    return sentence,word_sent


def graph_building(word_sent):
    graph=defaultdict(int)
    for words in word_sent:
        for i in range(len(words)):
            for j in range(i+1,len(words)):
                graph[(words[i],words[j])]+=abs(i-j)
    for key,values in graph.items():
        graph[key]=1/(1+values)
    return graph

def sentence_extraction(graph,word_sent,sentence):
    noun_score=defaultdict(int)
    for key,value in graph.items():
        noun_score[key[0][0]]+=value
    sent_score=defaultdict(int)
    for i,words in enumerate(word_sent):
        for word in words:
            sent_score[sentence[i].text]+=noun_score[word[0]]
    summary_sent=heapq.nlargest(10,sent_score,key=sent_score.get)
    summary_sent = "\n".join(summary_sent)
    return summary_sent


cv = pickle.load(open('./cv.sav','rb'))
model = pickle.load(open('./classifier.sav','rb'))
names = ['cs','math','physics','stat']

def classify(text):
    text = cv.transform(text)
    result = model.predict(text)
    result = names[result[0]]
    return result

# word frequency summarizer - summarizer 2

def nltk_summarizer(raw_text,n):
    stopWords=set(stopwords.words("english"))
    word_freq={}
    for word in nltk.word_tokenize(raw_text):
        if word not in stopWords and word not in string.punctuation:
            if word not in word_freq.keys():
                word_freq[word]=1
            else:
                word_freq[word]+=1
    max_freq=max(word_freq.values())
    
    for word in word_freq.keys():
        word_freq[word]=(word_freq[word])/max_freq
        
    sent_list=nltk.sent_tokenize(raw_text)
    sent_scores={}
    for sent in sent_list:
        for word in nltk.word_tokenize(sent.lower()):
            if word in word_freq.keys():
                if len(sent.split())<=30:
                    if sent not in sent_scores.keys():
                        sent_scores[sent]=word_freq[word]
                    else:
                        sent_scores[sent]+=word_freq[word]
                        
    summary_sent=heapq.nlargest(n,sent_scores,key=sent_scores.get)
    sent_summary = "\n".join(summary_sent)
    return sent_summary


#function to mine data from url
def extract_text_url(url):
    
    user_agent = 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.7) Gecko/2009021910 Firefox/3.0.7'


    headers={'User-Agent':user_agent} 

    request=urllib.request.Request(url,None,headers) #The assembled request
    response = urllib.request.urlopen(request)
    data = response.read() # The data u need

    text_extracted = ''
    text = fitz.open(stream=data, filetype="pdf")
    total_page_count = text.pageCount

    for page_num in range(total_page_count):
        page_ = text.loadPage(page_num).getText()
        page_ = page_.replace('\n', ' ')
        text_extracted += page_ + ' '
    
    return text_extracted



app = Flask(__name__)
CORS(app)

CONNECTION_STRING = "mongodb+srv://gatij:gatij@text-summarizer-cluster.xffam.mongodb.net/research_papers?retryWrites=true&w=majority"
client = pymongo.MongoClient(CONNECTION_STRING)
db = client.get_database('research_papers')
user_collection = pymongo.collection.Collection(db, 'user_collection')
print('DB connected')

#routes
@app.route('/')
def prit():
    return "Server Started"

#end pont to generate graph summary
@app.route('/api/graph_summary',methods=['POST'])
def generate_graph_summary():
        if request.method == 'POST':

            data = request.get_json()
            url = data['url']
            print(url)
            text = extract_text_url(url)
            
            #tokenize the text
            sentence, word_sent = tokenizer(text)
            
            #build the graph
            graph = graph_building(word_sent)
            
            #extract the summary
            graph_summary = sentence_extraction(graph,word_sent,sentence)

            

            print(classify([graph_summary]))

            category = classify([graph_summary])
            
            db.user_collection.insert_one({'subject':category,'summary':graph_summary})

            return jsonify(graph_summary)

            print('Saved in db')
            
            


#end point to generate word frequency summary
@app.route('/api/wordfreq_summary',methods=['POST'])
def generate_wordfreq_summary():
    if request.method == 'POST':
            
            data = request.get_json()
            n = data['sentences']           #number of sentences - user input
            url = data['url']
            print(url)
            text = extract_text_url(url)
            n = int(n)
            word_freq_summary = nltk_summarizer(text,n)

            

            print(classify([word_freq_summary]))

            category = classify([word_freq_summary])

            db.user_collection.insert_one({'subject':category,'summary':word_freq_summary})

            return jsonify(word_freq_summary)

            print('Saved in db')

            
            



            

#get data from the database
@app.route('/api/getdata',methods=['GET'])
def get_data():
    data = db.user_collection.find()
    data = dumps(data)
    return data


if __name__ == '__main__':
    app.run(port=5000)