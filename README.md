<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://34.42.95.33/">
    <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">ByteBreak</h3>

  <p align="center">
    An Online Code Execution Engine
    <br />
    <a href="https://github.com/rehans-Life/bytebreak"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/rehans-Life/bytebreak/issues">Report Bug</a>
    ·
    <a href="https://github.com/rehans-Life/bytebreak/issues">Request Feature</a>
  </p>
</div>

<!-- ABOUT THE PROJECT -->
## About The Project

<img src='https://firebasestorage.googleapis.com/v0/b/tesla-clone-a0f5d.appspot.com/o/readMe%2FScreenshot%202024-03-25%20094519.png?alt=media&token=caf170c9-9ebe-4788-b986-183c009f3489'/>

When I was learning and researching about data structures and algorithms, I wasn't only fascinated by the different algorithms and techniques that I was learning but also the 
code execution platforms where I was executing my code inside of. So I ended putting my developer skills to the test and went on to develop my very own online code execution 
platform where users can not only run their code but also contribute problems to the platform.  

And this is the unique feature about this platform that Im really proud of implementing although it did take me alot of time to design and code such a system, around one and a half 
months, it has helped me increase my developer skills not only in writing better code but it has also taught me how to design such complex systems as well. 

### Built With

#### FRONTEND:
<ul>
  <li>NextJS</li>
  <li>ReactJS</li>
  <li>Jotai, React Hook Form & React Query (State Management)</li>
  <li>Tailwind CSS (Styling)</li>
  <li>ShadCZN (Components)</li>
</ul>

#### BACKEND:
<ul>
  <li>NodeJS</li>
  <li>Express</li>
  <li>MongoDB</li>
  <li>Firebase Auth And Storage</li>
  <li>Judge0 (Code Execution)</li>
</ul>

#### DEVOPS:
<ul>
  <li>Docker</li>
  <li>Google Cloud</li>
  <li>Github Actions</li>
</ul>

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up of the project and running follow these simple steps.

### Installation
1. Clone the repo
 
   ```sh
   git clone https://github.com/rehans-Life/bytebreak.git
   ```
3. Install NPM packages

   ```sh
   npm install
   ```
### Add Environment Variables
Enter your API Keys in the `.env` files

   1. Enter your API Keys in `/client/.env.local`.

      ```js
      NEXT_PUBLIC_AUTH_DOMAIN= // firebase auth domain
      NEXT_PUBLIC_API_KEY= // firebase api key
      NEXT_PUBLIC_API_URL=http://localhost:4000
      ``` 

   2. Enter your API Keys in `/server/.env`

      ```js
      DB_PASSWORD= // mongodb password
      DB_URI= // mongo uri
      JWT_SECRET_KEY=example_secret_123
      JWT_EXPIRES_IN=90d
      JWT_COOKIE_EXPIRES_IN=90
      FIREBASE_STORAGE_URI= // firebase storage uri
      PORT=4000
      FRONTEND_URI=http://localhost:3000
      JUDGE0_API= // Get free plan at rapid api https://rapidapi.com/judge0-official/api/judge0-ce
      RAPID_API_HOST= // Get free plan at rapid api https://rapidapi.com/judge0-official/api/judge0-ce
      RAPID_API_KEY= // Get free plan at rapi api https://rapidapi.com/judge0-official/api/judge0-ce
      ```

### Run Docker Compose file
    
  ```sh
  docker compose -f docker-compose-dev.yml up
  ```

## Demos

<ul>
  <li>
<a href='https://www.loom.com/share/71ea8d56f2eb454a8619a56eb72f78b1?sid=8881e52c-a5d1-42a7-b30d-af5dec2aee5c'>Demo 1</a>
  </li>
  <li>
<a href='https://www.loom.com/share/16892563504c41f2b4ac1ab6eda17484?sid=2936934b-8f9e-431c-9eb5-d2f667723b41'>Demo 2</a>
  </li>
  <li>
<a href='https://www.loom.com/share/223fbe5cfd56419c897efb84793c3683?sid=cc6f688a-f807-4aa3-906b-a1c2265fd292'>Demo 3</a>
  </li>
  <li>
    <a href='https://www.loom.com/share/e5142195648f47f9b3e9b55bf51ce355?sid=6921ae14-1123-422c-a966-e961d90898c4' >Demo 4</a>
  </li>
</ul>

<!-- CONTACT -->
## Contact

Rehan Tosif - rehatosif4@gmail.com

Project Link: [https://github.com/rehans-Life/bytebreak](https://github.com/rehans-Life/bytebreak)
