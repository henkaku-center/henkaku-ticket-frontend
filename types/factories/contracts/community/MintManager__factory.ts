/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  MintManager,
  MintManagerInterface,
} from "../../../contracts/community/MintManager";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_newAdmins",
        type: "address[]",
      },
    ],
    name: "addAdmins",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_deleteAdmin",
        type: "address",
      },
    ],
    name: "deleteAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "isAdmin",
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
    inputs: [],
    name: "mintable",
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
    inputs: [],
    name: "switchMintable",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class MintManager__factory {
  static readonly abi = _abi;
  static createInterface(): MintManagerInterface {
    return new utils.Interface(_abi) as MintManagerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MintManager {
    return new Contract(address, _abi, signerOrProvider) as MintManager;
  }
}
