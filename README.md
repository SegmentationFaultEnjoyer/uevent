# UEVENT
---

App for creating events using blockchain technologies

## About app
---
App for managing events, where you can create your own company and make events that people will be able
to buy tickets for. App is using blockchain technologies to deliver you the ticket service. Each ticket 
is ERC721 contract that provides full ownership of ticket and abillity to send it to someone else.

<h3>Technology stack:</h3>
<ul>
	<li><b>Backend</b>: 	<i>NodeJS</i>, <i>Express</i>, <i>KNEX</i> </li>
	<li><b>Database</b>: 	<i>Postgresql</i> </li>
	<li><b>Smart contracts</b>: 	<i>Solidity</i> </li>
	<li><b>Frontend</b>: 	<i>React</i>, <i>TypeScript</i>, <i>SASS</i>, <i>MUI</i> </li>
	<li><b>Bundler</b>: 	<i>Vite</i> </li>
</ul>

<h3>Architecture:<h3>
<ul>
	<li><b>Server-API:</b> 	<i>REST and JSON-API specifications, MVC pattern</i> </li>
	<li><b>Database-API:</b> <i>builder pattern</i> </li>
	<li><b>Styles:</b> <i> BEM specification</i> </li>
	<li><b>Authentication:</b> <i> Web3 Auth</i> </li>
</ul>

<h3>Features:<h3>
<ul>	
	<li>Creating companies</li>
	<li>Creating events from the name of company</li>
	<li>Leaving comments under events</li>
	<li>Push and email notifications</li>
	<li>Buy ticket for cryptocurrency and obtain NFT's</li>
	<li>AI generation for event banner</li>
	<li>Incredible loaders, slow down your network just to face this beauty</li>
</ul>

<h3>Third-party services:<h3>
<ul>
	<li>Google API - for maps</li>
	<li>Metamask + ethers.js for handling cryptocurrency transactions</li>
	<li>OpenAI API - for generating banner of the event</li>
	<li>INFURA API - for uploading banner and NFT metadata to IPFS</li>
	<li>Mailgun - for email notifications</li>
</ul>
<hr>
<h2>Before start preparations</h2>

### 1. Database
---
    start postgresql server and create empty data base 

	# you can use docker compose file from the repo
	- docker compose up -d
    
### 2. Setup the environment
---
- Deploy <b>TokenFactory.sol</b> from the contracts folder. (You can use Remix or whatever IDE you like)
- Create ***.env*** file for backend and for frontend. Check ***.env.example*** in each folder.
	

### 3. Installing dependencies and preparing database
---
	yarn packages      
	cd server && yarn migrate

### 4. Starting app
---
	# start in different terminals or in daemon mode

	yarn dev:client 	#for developing mode
	yarn dev:server 	#for developing mode
