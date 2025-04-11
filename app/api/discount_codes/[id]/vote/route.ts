import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { isUpvote } = await request.json();
    const discountCodeId = params.id;
    
    if (typeof isUpvote !== 'boolean') {
      return NextResponse.json({ error: 'Invalid vote type' }, { status: 400 });
    }
    
    // First, get the current discount code to check if it exists
    const { data: existingCode, error: fetchError } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('id', discountCodeId)
      .single();
    
    if (fetchError || !existingCode) {
      return NextResponse.json({ error: 'Discount code not found' }, { status: 404 });
    }
    
    // Update the vote count
    const updateField = isUpvote ? 'upvotes' : 'downvotes';
    const { data, error } = await supabase
      .from('discount_codes')
      .update({ [updateField]: existingCode[updateField] + 1 })
      .eq('id', discountCodeId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating vote:', error);
      return NextResponse.json({ error: 'Failed to update vote' }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in POST /api/discount_codes/[id]/vote:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 