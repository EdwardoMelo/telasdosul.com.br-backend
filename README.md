🔥 Sulfire Institutional API
Backend service for an institutional website developed for a partner of SIRGS (Sulfire Sistemas Preventivos LTDA).
Built with Node.js, Express, and Prisma ORM, this API follows clean, scalable architecture and TDD principles.

🚀 Features
RESTful endpoints supporting CRUD operations

Database access via Prisma ORM over MySQL

Input validation and error handling

Automated tests with Jest

Environment configuration using .env

⚙️ Tech Stack
Node.js + Express — HTTP server

Prisma ORM — Type-safe data access layer

MySQL — Relational database

Jest — Testing framework

JavaScript / TypeScript-ready — Flexible codebase

🧩 Getting Started
1. Clone the repo
bash
Copiar
Editar
git clone https://github.com/EdwardoMelo/api.sulfire.com.br.git
cd api.sulfire.com.br
2. Install dependencies
bash
Copiar
Editar
npm install
3. Set up environment variables
Copy .env.example or .env.test to .env and configure:

ini
Copiar
Editar
DATABASE_URL="mysql://user:pass@localhost:3306/sulfire"
PORT=4000
4. Prepare the database
bash
Copiar
Editar
npx prisma migrate deploy
npx prisma generate
5. Start the server
bash
Copiar
Editar
npm start
The API will be available at http://localhost:<PORT>/.

🧪 Running Tests
Execute the test suite using:

bash
Copiar
Editar
npm test
Tests live in the /tests folder and cover major API endpoints and data logic.

📝 API Endpoints
(Examples — update according to actual routes in /src)

METHOD	URL	DESC
GET	/items	Get all items
GET	/items/:id	Get a single item by ID
POST	/items	Create a new item
PUT	/items/:id	Update an existing item
DELETE	/items/:id	Delete an item by ID

Success responses: 200 / 201
Error handling: 4xx (client) & 5xx (server)

📈 Code Structure
bash
Copiar
Editar
├── prisma/          # Prisma schema & migrations
├── src/
│   ├── controllers/ # Express route handlers
│   ├── routes/      # Route definitions
│   ├── services/    # Business logic
│   └── utils/       # Helpers and middleware
├── tests/           # Jest test cases
├── .env.*           # Environment variables
├── jest.config.js   # Jest configuration
└── package.json     # Project metadata & scripts
🛠 Common Commands
npm start – Build & launch server

npm run dev – Launch with live reload (e.g. using nodemon)

npm test – Run Jest suite

npx prisma migrate dev – Create new DB migration

npx prisma studio – Launch Prisma GUI

📬 Get in Touch
For questions, issues, or collaboration inquiries, reach out to Eduardo or open an issue here on GitHub.

👷‍♂️ Want to dive deeper? Feel free to explore the code and suggest improvements — contributions are welcome!

Let me know if you'd like to add badges, CI/CD setup info, deployment instructions, or anything specific to the project.
