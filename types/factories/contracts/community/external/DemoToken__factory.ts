/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  DemoToken,
  DemoTokenInterface,
} from "../../../../contracts/community/external/DemoToken";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "addWhitelistUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "users",
        type: "address[]",
      },
    ],
    name: "addWhitelistUsers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_of",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "dev",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "gateKeeper",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "isAllowed",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "removeWhitelistUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "users",
        type: "address[]",
      },
    ],
    name: "removeWhitelistUsers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "setDevAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "setGateKeeper",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unLock",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040526b033b2e3c9fd0803ce80000006006553480156200002157600080fd5b5060408051808201825260048082526344454d4f60e01b60208084018290528451808601909552918452908301529060036200005e838262000198565b5060046200006d828262000198565b5050506200008a620000846200009d60201b60201c565b620000a1565b6009805460ff60a01b1916905562000264565b3390565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b634e487b7160e01b600052604160045260246000fd5b600181811c908216806200011e57607f821691505b6020821081036200013f57634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200019357600081815260208120601f850160051c810160208610156200016e5750805b601f850160051c820191505b818110156200018f578281556001016200017a565b5050505b505050565b81516001600160401b03811115620001b457620001b4620000f3565b620001cc81620001c5845462000109565b8462000145565b602080601f831160018114620002045760008415620001eb5750858301515b600019600386901b1c1916600185901b1785556200018f565b600085815260208120601f198616915b82811015620002355788860151825594840194600190910190840162000214565b5085821015620002545787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b61148080620002746000396000f3fe608060405234801561001057600080fd5b50600436106101ae5760003560e01c80638da5cb5b116100ee578063b2e1311111610097578063dd62ed3e11610071578063dd62ed3e14610383578063ed10e33c146103bc578063f2fde38b146103c4578063f4887f15146103d757600080fd5b8063b2e131111461034a578063babcc5391461035d578063d0d41fe11461037057600080fd5b80639dc29fac116100c85780639dc29fac14610311578063a457c2d714610324578063a9059cbb1461033757600080fd5b80638da5cb5b146102e557806391cca3db146102f657806395d89b411461030957600080fd5b8063395093511161015b578063686b281211610135578063686b28121461028e57806370a08231146102a1578063715018a6146102ca57806384083c89146102d257600080fd5b8063395093511461023d57806340c10f191461025057806345d61ded1461026357600080fd5b806323b872dd1161018c57806323b872dd1461020657806330cc7ae014610219578063313ce5671461022e57600080fd5b806306fdde03146101b3578063095ea7b3146101d157806318160ddd146101f4575b600080fd5b6101bb6103ea565b6040516101c891906111bd565b60405180910390f35b6101e46101df366004611222565b61047c565b60405190151581526020016101c8565b6002545b6040519081526020016101c8565b6101e461021436600461124c565b610496565b61022c610227366004611288565b6104ba565b005b604051601281526020016101c8565b6101e461024b366004611222565b610564565b61022c61025e366004611222565b6105a3565b600854610276906001600160a01b031681565b6040516001600160a01b0390911681526020016101c8565b61022c61029c3660046112c0565b610616565b6101f86102af366004611288565b6001600160a01b031660009081526020819052604090205490565b61022c6106da565b61022c6102e0366004611288565b6106ee565b6005546001600160a01b0316610276565b600954610276906001600160a01b031681565b6101bb610796565b61022c61031f366004611222565b6107a5565b6101e4610332366004611222565b61081c565b6101e4610345366004611222565b6108c6565b61022c6103583660046112c0565b6108d4565b6101e461036b366004611288565b610998565b61022c61037e366004611288565b6109c5565b6101f8610391366004611385565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b61022c6109fc565b61022c6103d2366004611288565b610a45565b61022c6103e5366004611288565b610ad5565b6060600380546103f9906113b8565b80601f0160208091040260200160405190810160405280929190818152602001828054610425906113b8565b80156104725780601f1061044757610100808354040283529160200191610472565b820191906000526020600020905b81548152906001019060200180831161045557829003601f168201915b5050505050905090565b60003361048a818585610b0c565b60019150505b92915050565b6000336104a4858285610c65565b6104af858585610cf7565b506001949350505050565b6005546001600160a01b03163314806104dd57506008546001600160a01b031633145b806104f257506009546001600160a01b031633145b6105435760405162461bcd60e51b815260206004820152601f60248201527f494e56414c49443a204f4e4c592041444d494e2043414e20455845435554450060448201526064015b60405180910390fd5b6001600160a01b03166000908152600760205260409020805460ff19169055565b3360008181526001602090815260408083206001600160a01b038716845290915281205490919061048a908290869061059e908790611408565b610b0c565b806105ad60025490565b6105b79190611408565b60065410156106085760405162461bcd60e51b815260206004820152601160248201527f455843454544204d415820535550504c59000000000000000000000000000000604482015260640161053a565b6106128282610ee4565b5050565b6005546001600160a01b031633148061063957506008546001600160a01b031633145b8061064e57506009546001600160a01b031633145b61069a5760405162461bcd60e51b815260206004820152601f60248201527f494e56414c49443a204f4e4c592041444d494e2043414e204558454355544500604482015260640161053a565b60005b8151811015610612576106c88282815181106106bb576106bb61141b565b60200260200101516106ee565b806106d281611431565b91505061069d565b6106e2610fa3565b6106ec6000610ffd565b565b6005546001600160a01b031633148061071157506008546001600160a01b031633145b8061072657506009546001600160a01b031633145b6107725760405162461bcd60e51b815260206004820152601f60248201527f494e56414c49443a204f4e4c592041444d494e2043414e204558454355544500604482015260640161053a565b6001600160a01b03166000908152600760205260409020805460ff19166001179055565b6060600480546103f9906113b8565b6001600160a01b0382163314806107c657506005546001600160a01b031633145b6108125760405162461bcd60e51b815260206004820152601760248201527f494e56414c49443a204e4f5420594f5552204153534554000000000000000000604482015260640161053a565b610612828261105c565b3360008181526001602090815260408083206001600160a01b0387168452909152812054909190838110156108b95760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760448201527f207a65726f000000000000000000000000000000000000000000000000000000606482015260840161053a565b6104af8286868403610b0c565b60003361048a818585610cf7565b6005546001600160a01b03163314806108f757506008546001600160a01b031633145b8061090c57506009546001600160a01b031633145b6109585760405162461bcd60e51b815260206004820152601f60248201527f494e56414c49443a204f4e4c592041444d494e2043414e204558454355544500604482015260640161053a565b60005b8151811015610612576109868282815181106109795761097961141b565b60200260200101516104ba565b8061099081611431565b91505061095b565b60006109a2610fa3565b506001600160a01b03811660009081526007602052604090205460ff165b919050565b6109cd610fa3565b6009805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0392909216919091179055565b610a04610fa3565b600980547fffffffffffffffffffffff00ffffffffffffffffffffffffffffffffffffffff1674010000000000000000000000000000000000000000179055565b610a4d610fa3565b6001600160a01b038116610ac95760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f6464726573730000000000000000000000000000000000000000000000000000606482015260840161053a565b610ad281610ffd565b50565b610add610fa3565b6008805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0392909216919091179055565b6001600160a01b038316610b875760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460448201527f7265737300000000000000000000000000000000000000000000000000000000606482015260840161053a565b6001600160a01b038216610c035760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f20616464726560448201527f7373000000000000000000000000000000000000000000000000000000000000606482015260840161053a565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591015b60405180910390a3505050565b6001600160a01b038381166000908152600160209081526040808320938616835292905220546000198114610cf15781811015610ce45760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e6365000000604482015260640161053a565b610cf18484848403610b0c565b50505050565b6001600160a01b038316610d735760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f20616460448201527f6472657373000000000000000000000000000000000000000000000000000000606482015260840161053a565b6001600160a01b038216610def5760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201527f6573730000000000000000000000000000000000000000000000000000000000606482015260840161053a565b6001600160a01b03831660009081526020819052604090205481811015610e7e5760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e742065786365656473206260448201527f616c616e63650000000000000000000000000000000000000000000000000000606482015260840161053a565b6001600160a01b03848116600081815260208181526040808320878703905593871680835291849020805487019055925185815290927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a3610cf1565b6001600160a01b038216610f3a5760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015260640161053a565b8060026000828254610f4c9190611408565b90915550506001600160a01b038216600081815260208181526040808320805486019055518481527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a35050565b6005546001600160a01b031633146106ec5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161053a565b600580546001600160a01b0383811673ffffffffffffffffffffffffffffffffffffffff19831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6001600160a01b0382166110d85760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f2061646472657360448201527f7300000000000000000000000000000000000000000000000000000000000000606482015260840161053a565b6001600160a01b038216600090815260208190526040902054818110156111675760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e60448201527f6365000000000000000000000000000000000000000000000000000000000000606482015260840161053a565b6001600160a01b0383166000818152602081815260408083208686039055600280548790039055518581529192917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9101610c58565b600060208083528351808285015260005b818110156111ea578581018301518582016040015282016111ce565b506000604082860101526040601f19601f8301168501019250505092915050565b80356001600160a01b03811681146109c057600080fd5b6000806040838503121561123557600080fd5b61123e8361120b565b946020939093013593505050565b60008060006060848603121561126157600080fd5b61126a8461120b565b92506112786020850161120b565b9150604084013590509250925092565b60006020828403121561129a57600080fd5b6112a38261120b565b9392505050565b634e487b7160e01b600052604160045260246000fd5b600060208083850312156112d357600080fd5b823567ffffffffffffffff808211156112eb57600080fd5b818501915085601f8301126112ff57600080fd5b813581811115611311576113116112aa565b8060051b604051601f19603f83011681018181108582111715611336576113366112aa565b60405291825284820192508381018501918883111561135457600080fd5b938501935b828510156113795761136a8561120b565b84529385019392850192611359565b98975050505050505050565b6000806040838503121561139857600080fd5b6113a18361120b565b91506113af6020840161120b565b90509250929050565b600181811c908216806113cc57607f821691505b6020821081036113ec57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b80820180821115610490576104906113f2565b634e487b7160e01b600052603260045260246000fd5b600060018201611443576114436113f2565b506001019056fea2646970667358221220d5bf4c72e6db7c8e86103ac59d4a213d5f4e82bac94066d2c67604cdc6bdedae64736f6c63430008110033";

type DemoTokenConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DemoTokenConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class DemoToken__factory extends ContractFactory {
  constructor(...args: DemoTokenConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<DemoToken> {
    return super.deploy(overrides || {}) as Promise<DemoToken>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): DemoToken {
    return super.attach(address) as DemoToken;
  }
  override connect(signer: Signer): DemoToken__factory {
    return super.connect(signer) as DemoToken__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DemoTokenInterface {
    return new utils.Interface(_abi) as DemoTokenInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DemoToken {
    return new Contract(address, _abi, signerOrProvider) as DemoToken;
  }
}
