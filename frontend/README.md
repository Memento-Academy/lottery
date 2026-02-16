# Lottery Frontend

This is a Next.js frontend for the Lottery smart contract, built with:

- **Foundry**: For smart contract development and deployment.
- **Privy**: For authentication (Email, Wallet, Google) and embedded wallets.
- **ZeroDev**: For gasless transactions using Account Abstraction (ERC-4337).
- **Tailwind CSS**: For styling (downgraded to v3 for stability).

## Getting Started

1.  **Install Dependencies**:

    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Create a `.env.local` file with:

    ```env
    NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
    NEXT_PUBLIC_ZERODEV_PROJECT_ID=your_zerodev_project_id
    NEXT_PUBLIC_LOTTERY_ADDRESS=0xb83bB007936369AFA821769b6CCc96EC88320a61
    NEXT_PUBLIC_CHAIN=sepolia
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Deployment

To deploy on Vercel:

1.  Push the code to GitHub.
2.  Import the project in Vercel.
3.  Set the **Root Directory** to `frontend`.
4.  Add the environment variables (`NEXT_PUBLIC_PRIVY_APP_ID`, etc.) in the Vercel dashboard.
5.  Deploy!

## Key Features

- **Gasless Interaction**: Users don't need ETH to buy tickets; the Paymaster sponors the gas.
- **Embedded Wallets**: Users can login with email/Google and get a wallet automatically.
- **Real-time Updates**: The UI polls the contract for the latest prize pool and player count.
