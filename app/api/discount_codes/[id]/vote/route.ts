import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 401 })
    }
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // must be set securely (server only)
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    )
    
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
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
    
    // Check if the user has already voted on this discount code
    const { data: existingVote, error: voteCheckError } = await supabase
      .from('discount_code_votes')
      .select('*')
      .eq('user_id', user.id)
      .eq('discount_code_id', discountCodeId)
      .single();
    
    if (voteCheckError && voteCheckError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error checking existing vote:', voteCheckError);
      return NextResponse.json({ error: 'Failed to check existing vote' }, { status: 500 });
    }
    
    let voteData;
    
    if (existingVote) {
      // User has already voted, update their vote
      if (existingVote.vote_type === (isUpvote ? 'upvote' : 'downvote')) {
        // User is voting the same way again, no change needed
        return NextResponse.json({ 
          message: 'Vote already recorded',
          vote: existingVote,
          discountCode: existingCode
        });
      } else {
        // User is changing their vote
        const { data: updatedVote, error: updateVoteError } = await supabase
          .from('discount_code_votes')
          .update({ vote_type: isUpvote ? 'upvote' : 'downvote' })
          .eq('user_id', user.id)
          .eq('discount_code_id', discountCodeId)
          .select()
          .single();
        
        if (updateVoteError) {
          console.error('Error updating vote:', updateVoteError);
          return NextResponse.json({ error: 'Failed to update vote' }, { status: 500 });
        }
        
        voteData = updatedVote;
        
        // Update both vote counts
        const oldVoteType = existingVote.vote_type;
        const newVoteType = isUpvote ? 'upvote' : 'downvote';
        
        const { data, error } = await supabase
          .from('discount_codes')
          .update({ 
            [oldVoteType === 'upvote' ? 'upvotes' : 'downvotes']: existingCode[oldVoteType === 'upvote' ? 'upvotes' : 'downvotes'] - 1,
            [newVoteType === 'upvote' ? 'upvotes' : 'downvotes']: existingCode[newVoteType === 'upvote' ? 'upvotes' : 'downvotes'] + 1
          })
          .eq('id', discountCodeId)
          .select()
          .single();
        
        if (error) {
          console.error('Error updating vote counts:', error);
          return NextResponse.json({ error: 'Failed to update vote counts' }, { status: 500 });
        }
        
        return NextResponse.json({
          ...data,
          vote: voteData
        });
      }
    } else {
      // User hasn't voted yet, create a new vote
      const { data: newVote, error: voteError } = await supabase
        .from('discount_code_votes')
        .insert({
          user_id: user.id,
          discount_code_id: discountCodeId,
          vote_type: isUpvote ? 'upvote' : 'downvote'
        })
        .select()
        .single();
      
      if (voteError) {
        console.error('Error creating vote record:', voteError);
        return NextResponse.json({ error: 'Failed to record vote' }, { status: 500 });
      }
      
      voteData = newVote;
      
      // Update the vote count on the discount code
      const updateField = isUpvote ? 'upvotes' : 'downvotes';
      const { data, error } = await supabase
        .from('discount_codes')
        .update({ [updateField]: existingCode[updateField] + 1 })
        .eq('id', discountCodeId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating vote count:', error);
        return NextResponse.json({ error: 'Failed to update vote count' }, { status: 500 });
      }
      
      return NextResponse.json({
        ...data,
        vote: voteData
      });
    }
  } catch (error) {
    console.error('Error in POST /api/discount_codes/[id]/vote:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 