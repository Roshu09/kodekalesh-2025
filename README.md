# 🧠 MindTrack - Mental Wellbeing Early Detection System

An AI-powered mental health monitoring platform that provides early detection of psychological stress through behavioral analysis and self-assessment.

## 🎯 Problem Statement

Mental wellbeing services remain severely constrained by:
- Limited clinical manpower
- Inconsistent self-reporting
- Absence of continuous behavioral monitoring

Individuals experiencing early psychological stress indicators often remain undetected until symptoms intensify, leading to escalated crises and long-term societal burdens.

## ✨ Features

- **Quick 5-Question Assessment** - Evidence-based screening covering sleep, mood, appetite, focus, and social activity
- **AI-Powered Risk Scoring** - Intelligent analysis categorizing risk as Low, Moderate, or High
- **Beautiful Visualizations** - Interactive charts and graphs showing wellness trends
- **Personalized Recommendations** - Tailored guidance based on assessment results
- **Blockchain Badges** - Mint completion certificates as NFTs on Aptos testnet
- **AWS Backend** - Scalable cloud infrastructure with DynamoDB storage
- **Privacy-First** - Only anonymized data is stored
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🚀 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Charts**: Recharts for data visualization
- **Blockchain**: Aptos (Petra/Martian wallet support)
- **Backend**: AWS Lambda + DynamoDB
- **Deployment**: Vercel (Frontend) + AWS Amplify (Backend)

## 📦 Installation

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Aptos wallet (Petra or Martian) for blockchain features

### Setup Steps

1. **Clone the repository**
   \`\`\`bash
   git clone <your-repo-url>
   cd mindtrack
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Configure environment variables**
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   
   Edit `.env` and add your AWS credentials:
   \`\`\`env
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   DYNAMODB_RESULTS_TABLE=mindtrack-results
   DYNAMODB_BADGES_TABLE=mindtrack-badges
   \`\`\`

4. **Run development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open in browser**
   Navigate to `http://localhost:3000`

## 🗄️ AWS Setup (Production)

### DynamoDB Tables

Create two DynamoDB tables:

**1. mindtrack-results**
- Primary Key: `id` (String)
- Attributes:
  - `score` (Number)
  - `level` (String)
  - `timestamp` (String)
  - `answersHash` (String)

**2. mindtrack-badges**
- Primary Key: `id` (String)
- Attributes:
  - `transactionHash` (String)
  - `walletAddress` (String)
  - `network` (String)
  - `timestamp` (String)

### Lambda Functions

The API routes in `app/api/` are Lambda-ready. Deploy using:

\`\`\`bash
# Install AWS SDK
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb

# Deploy with AWS Amplify or SAM
amplify init
amplify add api
amplify push
\`\`\`

### IAM Permissions

Ensure your Lambda functions have these permissions:
\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:Query"
      ],
      "Resource": [
        "arn:aws:dynamodb:*:*:table/mindtrack-results",
        "arn:aws:dynamodb:*:*:table/mindtrack-badges"
      ]
    }
  ]
}
\`\`\`

## 🔗 Aptos Integration

### Wallet Setup

1. Install Petra wallet: https://petra.app/
2. Or install Martian wallet: https://martianwallet.xyz/
3. Switch to Aptos Testnet
4. Get testnet tokens from faucet

### Minting Badges

After completing an assessment:
1. Click "Mint on Aptos Testnet"
2. Approve wallet connection
3. Confirm transaction
4. View your badge in Aptos Explorer

## 📱 User Flow

\`\`\`
Home Page → Start Assessment → 5 Questions → Results Page → (Optional) Mint Badge
\`\`\`

1. **Home**: Learn about MindTrack features
2. **Assessment**: Answer 5 evidence-based questions
3. **Results**: View risk score, visualizations, and recommendations
4. **Badge Minting**: Optional blockchain certificate

## 🏥 Safety & Disclaimers

**⚠️ IMPORTANT**: This is a screening tool, not a medical diagnosis.

- Always consult qualified healthcare professionals
- For crisis support: Call 988 (US Mental Health Hotline)
- Emergency: Call 911 or local emergency services

## 🚢 Deployment

### Vercel (Frontend)

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
\`\`\`

### AWS Amplify (Full Stack)

\`\`\`bash
# Initialize Amplify
amplify init

# Add hosting
amplify add hosting

# Deploy
amplify publish
\`\`\`

## 📄 License

Built for AWS & Aptos Hackathon 2025

## 🤝 Contributing

This is a hackathon project. Contributions welcome!

## 📧 Support

For questions or issues, please open a GitHub issue.

---

**Remember**: Mental health matters. Seek professional help when needed. 💙
