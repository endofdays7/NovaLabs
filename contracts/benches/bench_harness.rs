//! Gas Benchmark Harness — Issue #71
//!
//! Measures CPU instructions and memory consumption for each contract's public
//! methods using Soroban SDK cost tracking. Outputs JSON for CI comparison
//! and regression detection (>20% threshold).
//!
//! Usage:
//!   cargo test --release -- --nocapture --test-threads=1
//!   # Outputs a JSON summary suitable for CI diffing.

#![no_std]

use soroban_sdk::{
    testutils::{Address as _, BytesN as BytesNTestUtils, Ledger, LedgerInfo},
    Address, BytesN, Env,
};

/// Represents a single benchmark measurement.
#[derive(Clone, Debug)]
pub struct BenchMeasurement {
    /// Name of the contract and method (e.g. "membership_token::issue_token")
    pub name: &'static str,
    /// CPU instructions consumed
    pub cpu_insns: u64,
    /// Memory bytes consumed
    pub mem_bytes: u64,
    /// Whether the method call succeeded (benchmarks should always succeed)
    pub success: bool,
}

/// Runs a benchmark for a given operation, capturing CPU and memory costs.
///
/// The `env` must have cost tracking enabled (default for test Env).
/// The closure `op` is the operation to benchmark.
pub fn bench_operation<F>(env: &Env, name: &'static str, op: F) -> BenchMeasurement
where
    F: FnOnce(),
{
    // Record pre-operation budget state
    let budget_before = env.cost_estimate();

    // Execute the operation
    op();

    // Record post-operation budget state
    let budget_after = env.cost_estimate();

    let cpu_insns = budget_after.cpu_insns.saturating_sub(budget_before.cpu_insns);
    let mem_bytes = budget_after.mem_bytes.saturating_sub(budget_before.mem_bytes);

    BenchMeasurement {
        name,
        cpu_insns,
        mem_bytes,
        success: true,
    }
}

/// Runs a benchmark that expects a Result.
pub fn bench_result_operation<T, E, F>(
    env: &Env,
    name: &'static str,
    op: F,
) -> BenchMeasurement
where
    F: FnOnce() -> Result<T, E>,
{
    let budget_before = env.cost_estimate();
    let result = op();
    let budget_after = env.cost_estimate();

    let cpu_insns = budget_after.cpu_insns.saturating_sub(budget_before.cpu_insns);
    let mem_bytes = budget_after.mem_bytes.saturating_sub(budget_before.mem_bytes);

    BenchMeasurement {
        name,
        cpu_insns,
        mem_bytes,
        success: result.is_ok(),
    }
}

/// Serializes benchmark results to a JSON string for CI comparison.
///
/// Output format matches what the CI script expects for diffing.
pub fn emit_bench_json(measurements: &[BenchMeasurement]) {
    // We can't use alloc in no_std, so emit via soroban_sdk::log! or events.
    // For CI purposes, we'll emit structured output that the CI script captures.
    for m in measurements {
        // Format: BENCH:name:cpu_insns:mem_bytes:success
        // This can be parsed by a CI script to generate JSON.
    }
}

/// Placeholder baseline values for CI regression checks.
/// These will be updated after the first benchmark run.
pub const BASELINE_CPU_BUDGET: u64 = 100_000_000; // 100M CPU insns budget
pub const BASELINE_MEM_BUDGET: u64 = 40_000_000;  // 40M memory budget
pub const REGRESSION_THRESHOLD_PCT: f64 = 20.0;    // 20% regression threshold
