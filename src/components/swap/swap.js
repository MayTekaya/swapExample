import React from "react";
import Web3 from "web3";
import Stepper from "react-js-stepper";
import "./swap.css";
import SwapContract from "../../swapContract";
import AbcContract from "../../ABCContract";
import XyzContract from "../../XYZContract";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import moment from "moment";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));


const steps = [{ title: "Approve" }, { title: "Swap" }];
const web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545");
const SWAPContract = new web3.eth.Contract(
  SwapContract.AbiSwap,
  SwapContract.addressSwap
);
const ABCContract = new web3.eth.Contract(
  AbcContract.AbiABC,
  AbcContract.addressABC
);
// const XYZContract = new web3.eth.Contract(
//   XyzContract.AbiXYZ,
//   XyzContract.addressXYZ
// );
class Swap extends React.Component {
  constructor() {
    super();
    this.state = {
      XYZAmount: 0,
      ABCAmount: 0,
      activeStep: 1,
      text: "Approve",
      swaps: [],
    };
  }

   componentDidMount() {
   
   setInterval(() => {
      this.getSwaps();
    }, 100);

}
  nextStep = () => {
    let nextstep = this.state.activeStep + 1;
    this.setState({ activeStep: nextstep });
  };
  swap = async () => {
    const transactionParameters = {
      to: SwapContract.addressSwap,
      from: this.props.address,
      data: SWAPContract.methods
        .swap(
          AbcContract.addressABC,
          XyzContract.addressXYZ,
          Math.floor(900000 * Math.random()) + 100000,
          web3.utils.toBN(this.state.ABCAmount * Math.pow(10, 18))
        )
        .encodeABI(),
    };
    console.log(
      AbcContract.addressABC,
      XyzContract.addressXYZ,
      Math.floor(900000 * Math.random()) + 100000,
      this.state.ABCAmount * Math.pow(10, 18)
    );

    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum
        .request({
          method: "eth_sendTransaction",
          params: [transactionParameters],
        })
        .then((result) => {
          //   this.setState({ text: "Pending transaction" });
          //   if (scenario !== "B") {
          //     this.props.notifyDoneApprove();
          //   } else if (scenario === "B") {
          //     //  prevActiveStep = prevActiveStep + 1;
          //     this.props.notifyDoneApproveB();
          //   }
        })
        .catch((error) => {
          console.log(error);
          //   this.props.notifyWrong();
        });
    }
  };

  approve = async () => {
    const amount = web3.utils.toBN(this.state.ABCAmount * Math.pow(10, 18));
    const transactionParameters = {
      to: AbcContract.addressABC,
      from: this.props.address,
      data: ABCContract.methods
        .approve(SwapContract.addressSwap, amount.toString())
        .encodeABI(),
    };

    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum
        .request({
          method: "eth_sendTransaction",
          params: [transactionParameters],
        })
        .then((result) => {
          this.nextStep();
          console.log(result);
          this.setState({ text: "swap" });
          //   this.setState({ text: "Pending transaction" });
          //   if (scenario !== "B") {
          //     this.props.notifyDoneApprove();
          //   } else if (scenario === "B") {
          //     //  prevActiveStep = prevActiveStep + 1;
          //     this.props.notifyDoneApproveB();
          //   }
        })
        .catch((error) => {
          console.log(error);
          //   this.props.notifyWrong();
        });
    }
  };
  getSwaps = async () => {
    let sw = [];
    await SWAPContract.methods.getSwapsNb().call(async (err, nbS) => {
      for (let i = 0; i < nbS.length; i++) {
        await SWAPContract.methods.getSwap(nbS[i]).call((errS, swap) => {
          console.log(swap);
          const s={
              swapId: nbS[i],
              date: swap[0],
              wallet: swap[3],
              abcAmount: swap[1]/1000000000000000000,
              xyzAmount: swap[2]/1000000000000000000
          }
          sw.push(s);
        });
        //  SWAPContract.methods.getSwapsNb().call((err,nbS)=>{})
      }
      this.setState({swaps: sw})
    });
  };
  render() {
    return (
      <div className="homeswap">
        <div className="swapdiv">
          <input
            className="input"
            type="number"
            name="name"
            placeholder="Enter the number of tokens to exchange"
            onChange={(e) => {
               // let rule=0;
            //    console.log(SWAPContract)
            //     SWAPContract.rule.call().then((errRes, res) => {
            //         console.log(res)
            //         //rule=res
            //     })
              const calculatedXYZ =
                e.target.value * 3 - (e.target.value * 3 * 3) / 100;
              this.setState({
                ABCAmount: e.target.value,
                XYZAmount: calculatedXYZ,
              });
            }}
          />
          <div className="text">vs {this.state.XYZAmount} XYZ</div>
          <button
            disabled={this.props.address === ""}
            onClick={() => {
              if (this.state.activeStep === 1) {
                this.approve();
              } else {
                this.swap();
              }
            }}
            className="btn2"
          >
            {this.state.text}
          </button>
        </div>
        <Stepper
          steps={steps}
          className="stepper"
          activeStep={this.state.activeStep}
          // onSelect={this.handleOnClickStepper}
          showNumber={false}
        />
         <TableContainer component={Paper} className="swapstab">
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>SwapId</StyledTableCell>
                <StyledTableCell align="center">ABC Token</StyledTableCell>
                <StyledTableCell align="center">XYZ Token</StyledTableCell>
                <StyledTableCell align="center">Wallet</StyledTableCell>
                <StyledTableCell align="center">
                 Date
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.swaps.map((row) => (
                <StyledTableRow key={row.swapId}>
                  <StyledTableCell component="th" scope="row">
                    {row.swapId}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.abcAmount}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.xyzAmount}</StyledTableCell>
                  <StyledTableCell align="center">{row.wallet}</StyledTableCell>
                  <StyledTableCell align="center">{moment.unix(Math.round((row.date))).format("DD/MM/YYYY HH:mm")}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer> 
        {/* <div className="swapstab">swaps table</div>
        <button
            disabled={this.props.address === ""}
            onClick={() => {
            
                this.getSwaps();
            
            }}
            className="btn2"
          >
            get
          </button> */}
      </div>
    );
  }
}
export default Swap;
