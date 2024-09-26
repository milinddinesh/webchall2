# Lazy_Admin

### Challenge authors: 231tr0n, BluBerryPickle, retrymp3

## Challenge Description
"Why do i have to log out anyway? It's just a ping service ..."

## Short Write-up
Register account ->login
Edit cookie ; set user : admin and user_id : 1340 (Use burpsuite) . Reload the page.
Give a random ip to ping along with a bash command as payload to get the flag 

## Flag
flag{C0mm4nd_1nject1On_c4n_b_d34dly}

## Tested By
BluBerryPickle, retrymp3

challenge files are in /var/www/html/
