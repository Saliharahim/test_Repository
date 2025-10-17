"""
train.py — simple smoke test training script
Run using:
    python -m examples.train --smoke-test
"""

import argparse
import time
import random

def train_one_epoch(epoch, smoke_test=False):
    """Simulated training loop."""
    num_batches = 3 if smoke_test else 100
    loss = 0.0

    for batch in range(num_batches):
        # Simulate some computation
        time.sleep(0.1 if smoke_test else 0.5)
        loss = random.random()
        print(f"[Epoch {epoch+1}] Batch {batch+1}/{num_batches} - Loss: {loss:.4f}")

    return loss


def main():
    parser = argparse.ArgumentParser(description="Sample training script for CI smoke test.")
    parser.add_argument("--epochs", type=int, default=2, help="Number of epochs to run.")
    parser.add_argument("--smoke-test", action="store_true", help="Run a fast smoke test version.")
    args = parser.parse_args()

    print("🚀 Starting training...")
    print(f"Mode: {'Smoke test' if args.smoke_test else 'Full training'}")
    print(f"Epochs: {args.epochs}")

    for epoch in range(args.epochs):
        loss = train_one_epoch(epoch, smoke_test=args.smoke_test)
        print(f"✅ Epoch {epoch+1} complete. Last batch loss: {loss:.4f}")

    print("🎉 Training completed successfully!")

 
if __name__ == "__main__": 
    main()
  