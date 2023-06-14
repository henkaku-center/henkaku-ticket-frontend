/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  Administration,
  AdministrationInterface,
} from "../../../contracts/community/Administration";

const _abi = [
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
] as const;

export class Administration__factory {
  static readonly abi = _abi;
  static createInterface(): AdministrationInterface {
    return new utils.Interface(_abi) as AdministrationInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Administration {
    return new Contract(address, _abi, signerOrProvider) as Administration;
  }
}
