import os
import sys
import time
from urllib import FancyURLopener
import urllib2
import simplejson

#This is adopted from here:
#http://stackoverflow.com/questions/11242967/python-search-with-image-google-images



def search_google(searchTerm, searchtype='web'):
    """Search google and return the first result.
    searchTerm: Term to search
    searchtype: set to web, images, news
    """

    # Replace spaces ' ' in search term for '%20' in order to comply with request
    searchTerm = searchTerm.replace(' ','%20')

    #url to use
    url = ('https://ajax.googleapis.com/ajax/services/search/'+searchtype+'?' + 'v=1.0&q='+searchTerm+'&start=0&userip=MyIP')
    request = urllib2.Request(url, None, {'Referer': 'testing'})
    response = urllib2.urlopen(request)

    # Get results using JSON
    results = simplejson.load(response)
    data = results['responseData']
    dataInfo = data['results']

    return dataInfo[0]['unescapedUrl']

