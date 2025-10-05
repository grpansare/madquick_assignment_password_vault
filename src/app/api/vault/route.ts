import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { getAuthUser } from '@/lib/auth';

// GET - Fetch all vault items for authenticated user
export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('password-vault');
    const vaultItems = db.collection('vault_items');

    const items = await vaultItems
      .find({ userId: user.userId })
      .sort({ updatedAt: -1 })
      .toArray();

    return NextResponse.json({ items }, { status: 200 });
  } catch (error) {
    console.error('Fetch vault items error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new vault item
export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, username, password, url, notes, tags } = await request.json();

    if (!title || !username || !password) {
      return NextResponse.json(
        { error: 'Title, username, and password are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('password-vault');
    const vaultItems = db.collection('vault_items');

    const newItem = {
      userId: user.userId,
      title,
      username,
      password, // This should be encrypted on the client side
      url: url || '',
      notes: notes || '',
      tags: tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await vaultItems.insertOne(newItem);

    return NextResponse.json(
      { message: 'Vault item created successfully', itemId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create vault item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update vault item
export async function PUT(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { _id, title, username, password, url, notes, tags } = await request.json();

    if (!_id || !title || !username || !password) {
      return NextResponse.json(
        { error: 'ID, title, username, and password are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('password-vault');
    const vaultItems = db.collection('vault_items');

    const result = await vaultItems.updateOne(
      { _id: new ObjectId(_id), userId: user.userId },
      {
        $set: {
          title,
          username,
          password, // This should be encrypted on the client side
          url: url || '',
          notes: notes || '',
          tags: tags || [],
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Vault item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Vault item updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update vault item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete vault item
export async function DELETE(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('id');

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('password-vault');
    const vaultItems = db.collection('vault_items');

    const result = await vaultItems.deleteOne({
      _id: new ObjectId(itemId),
      userId: user.userId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Vault item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Vault item deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete vault item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
