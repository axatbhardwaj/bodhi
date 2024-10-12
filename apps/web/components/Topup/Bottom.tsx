interface Props {
    balanceBodhi:any;
    balanceFUSDC:any;
}

export const Bottom = ({balanceBodhi,balanceFUSDC}:Props) => {
    return  <div className="mt-6 text-center">
    <p className="text-gray-700 dark:text-gray-400">
      Your current Bodhi balance:{" "}
      <span className="font-bold text-green-600 dark:text-green-400">
      {balanceBodhi?.toString() || "0"} BODHI
      </span>
    </p>
    <p className="text-gray-700 dark:text-gray-400">
      Your current Fake Usdc balance:{" "}
      <span className="font-bold text-green-600 dark:text-green-400">
      {balanceFUSDC?.toString() || "0"} FUSDC
      </span>
    </p>
  </div>
}