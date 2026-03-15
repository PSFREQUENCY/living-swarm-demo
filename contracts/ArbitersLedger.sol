// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title ArbitersLedger
/// @notice Event-only onchain attestation for Living Swarm threat scores.
///         No storage — just permanent events in the Sepolia block history.
contract ArbitersLedger {
    event ScoreLogged(
        bytes32 indexed inputHash,
        uint8           score,
        bytes1          band,
        address indexed arbiter,
        uint256         timestamp
    );

    /// @notice Log an arbiter risk assessment onchain.
    /// @param inputHash  keccak256 of the swap parameters (privacy-preserving)
    /// @param score      Risk score 0–100
    /// @param band       Single ASCII char: P=PASS, L=LOG, H=HOLD, B=BLOCK
    function logScore(bytes32 inputHash, uint8 score, bytes1 band) external {
        require(score <= 100, "score out of range");
        emit ScoreLogged(inputHash, score, band, msg.sender, block.timestamp);
    }
}
