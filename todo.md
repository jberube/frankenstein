# notes

## goals
- decouple 'server' from 'REST api'
- allow unit testing of each parts
- clearly define responsabilities of each parts
- identify the means of communication between parts

## parts
server: business logic thingy, allows the magc to happen
REST api: REST api, allows calls to be made to the server via http requests
SysTest: system tests, make sure everything actually works 
server_harness: allow the SysTests to provoke things and make assertions on the server
client_harness: allow the SysTests to provoke things and make assertions in the page

## schema
```
[SysTest] <-js-> [server_harness] <-?-----> [server] <-js- [REST api] <-.
       A                                                                |
       '----js-> [client_harness] -zombie-> [page] -http----------------'
```

# backlog
stuff to be done

## proof of concepts

### todo
- to prove I can have interraction with a remote server in a test, make an asynchronous call to a  server and assert it's response
- to prove I can interact with the DOM in a test, use a component that have an asynchronous behavior and that interacts with the DOM in the page and assert it's state

### done
- to prove I can get a test running, do a simple test that asserts a value in the DOM

## technical

### todo
- to allow testing locally or on cloud ide (i.e. Koding), allow to change ip address in server/server.js last line
- make local the refrence to <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script> in web/index.html

### done


