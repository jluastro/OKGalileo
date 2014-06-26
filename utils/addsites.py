import os
from time import sleep
from pyraf import iraf
import datetime 
import warnings
import gdata.spreadsheet.text_db
from gdata.spreadsheet.service import SpreadsheetsService

from astropy.coordinates import Angle
import astropy.units as u

from searchgoogle import search_google

def get_degrees(ang_str):
    """Convert ang_str to degrees. This is to handle the multiple different formats
       in the obs db file
    """
    if ang_str.count(':')==1:
       #in weird d:m sexagesimal
       l = ang_str.split(':')
       d = l[0]
       m = int(float(l[1]))
       s = 60.0*(float(l[1]) - m )
       a = '%s:%s:%s' % (d,m,s)
       return Angle(a, u.degree).value
    elif ang_str.count(':')==2:
         return Angle(ang_str, u.degree).value
    else:
    #assumes decimal
        return Angle(ang_str, u.degree).value
    
def get_website(name):
    """Get the website of the observatory"""
    try:
       website=search_google(name, searchtype='web')
    except:
       website=''
    return website

def get_image(name):
    """Get the website of the observatory"""
    try:
        image = search_google(name, searchtype='images') 
    except:   
        image = ''
    return image
       

def read_obsdb(filename='obsdb.dat'):  
    """Read in the observatory data base and return a 
       list with a dictionary for each obervatory
    """

    obs_list=[]
    with open(filename) as obsdata:
         lines = obsdata.readlines()
         for i in range(len(lines)):
             l = lines[i].strip()
             if l.startswith('#') or not l:
                   continue
             if l.count('observatory'):
                l = lines[i].strip()
                short = lines[i].strip().split('=')[1].replace('"', '').strip()
                name = unicode(lines[i+1].strip().split('=')[1].replace('"', '').strip(), errors='replace')
                lon = str(get_degrees(lines[i+2].strip().split('=')[1].replace('"', '').strip()))
                lat = str(get_degrees(lines[i+3].strip().split('=')[1].replace('"', '').strip()))
                alt = lines[i+4].strip().split('=')[1].replace('"', '').strip()
                try:
                  tz = lines[i+5].strip().split('=')[1].replace('"', '').strip()
                except:
                  tz = ''
                obs = {}
                obs['timestamp'] = datetime.datetime.now().strftime('%m/%d/%Y %H:%M:%S')
                obs['nameofthesite'] = name
                obs['shortnameforsite'] = short
                obs['longitude'] = lon
                obs['latitude'] = lat
                obs['altitude'] = alt
                obs['timezone'] = tz
                obs_list.append(obs)
    return obs_list

def get_sitenames():
    """Get the sites names from the google shee"""

    #get the data from the spreadsheet
    client = SpreadsheetsService()
    client.email=os.environ.get('GMAIL')
    client.password=os.environ.get('GPASS')
    client.source = 'Observatories'
    client.ProgrammaticLogin()

    key = '1c2ZuB_FYI0uj-f2a_OSG3uK_OsyCpdgeVSXAUrVqkR8'
    wksht_id = '1314881749'
    feed = client.GetListFeed(key, wksht_id)

    sitenames = []
    for row in feed.entry:
      record = gdata.spreadsheet.text_db.Record(row_entry=row)
      sitenames.append(record.content['shortnameforsite'])
    return sitenames


def addsites(site):
    """Script for adding sites from the IRAF database of observatories.  The script should 
       produce a list of the observatories, check to see if the observatory is already
       in the list.  If it is not, it should then add the observatory to thie list.

       It should attempt to grab the observatory website and a link to an image of 
       the observatory.
    """
    #get the data from the spreadsheet
    client = SpreadsheetsService()
    client.email=os.environ.get('GMAIL')
    client.password=os.environ.get('GPASS')
    client.source = 'Observatories'
    client.ProgrammaticLogin()

    key = '1c2ZuB_FYI0uj-f2a_OSG3uK_OsyCpdgeVSXAUrVqkR8'
    wksht_id = '1314881749'
    feed = client.GetListFeed(key, wksht_id)

    sitenames = []
    for row in feed.entry:
      record = gdata.spreadsheet.text_db.Record(row_entry=row)
      sitenames.append(record.content['shortnameforsite'])

    if site['shortnameforsite'] in sitenames: 
       #warnings.warn('%s is already in the list' % site['shortnameforsite'])
       return 

    #Add the website and page
    print site['nameofthesite']
    site['website'] = get_website(site['nameofthesite'])
    site['image'] = get_image(site['nameofthesite'])

    client.InsertRow(site, key, wksht_id)
    sleep(1)
    return

if __name__=='__main__':
   obs_list = read_obsdb()
   sitenames = get_sitenames()
   i=0
   for s in obs_list:
      if s['shortnameforsite'] in sitenames: 
         #warnings.warn('%s is already in the list' % site['shortnameforsite'])
         continue 
      addsites(s)
      i = i + 1
