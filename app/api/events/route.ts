import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { DanceStyle } from '@/lib/constants'

// Define valid styles enum to match database constraint
const VALID_STYLES = ['bachata', 'salsa', 'kizomba', 'zouk'] as const

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ 
      cookies: () => cookieStore 
    }, {
      options: {
        db: {
          schema: 'public'
        }
      }
    })

    const { data: events, error } = await supabase
      .from('events')
      .select(`
        *,
        event_styles (
          style
        ),
        event_artists (
          artist:artists (
            id,
            name
          )
        )
      `)
      .order('start_date', { ascending: false })

    if (error) {
      console.error('Error fetching events:', error)
      return NextResponse.json(
        { error: 'Failed to fetch events' },
        { status: 500 }
      )
    }

    return NextResponse.json(events)
  } catch (error) {
    console.error('Error in GET /api/events:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ 
      cookies: () => cookieStore 
    }, {
      options: {
        db: {
          schema: 'public'
        }
      }
    })
    
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const json = await request.json()
    const {
      name,
      startDate,
      endDate,
      city,
      country,
      website,
      description,
      posterUrl,
      facebookLink,
      instagramLink,
      artists = [],
      styles = [],
    }: {
      name: string
      startDate: string
      endDate: string
      city: string
      country: string
      website?: string | null
      description?: string | null
      posterUrl?: string | null
      facebookLink?: string | null
      instagramLink?: string | null
      artists?: string[]
      styles?: DanceStyle[]
    } = json

    console.log('Received styles:', styles)

    // Validate required fields
    if (!name || !startDate || !endDate || !city || !country) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Start a transaction by using single batch
    const { data: event, error: eventError } = await supabase
      .from('events')
      .insert({
        name,
        start_date: startDate,
        end_date: endDate,
        city,
        country,
        website: website || null,
        description: description || null,
        poster_url: posterUrl || null,
        created_by: session?.user?.id || null,
        facebook_link: facebookLink || null,
        instagram_link: instagramLink || null,
      })
      .select()
      .single()

    if (eventError) {
      console.error('Error creating event:', eventError)
      return NextResponse.json(
        { error: 'Failed to create event' },
        { status: 500 }
      )
    }

    // If there are artists, save them to event_artists table
    if (artists.length > 0) {
      // First get the artist IDs from the artists table
      const { data: artistData, error: artistError } = await supabase
        .from('artists')
        .select('id, name')
        .in('name', artists)

      if (artistError) {
        console.error('Error fetching artists:', artistError)
        return NextResponse.json(
          { error: 'Failed to fetch artists' },
          { status: 500 }
        )
      }

      if (!artistData) {
        console.error('No artists found')
        return NextResponse.json(
          { error: 'Failed to find artists' },
          { status: 500 }
        )
      }

      // Create event_artists entries
      const eventArtistsData = artistData.map(artist => ({
        event_id: event.id,
        artist_id: artist.id
      }))

      const { error: eventArtistsError } = await supabase
        .from('event_artists')
        .insert(eventArtistsData)

      if (eventArtistsError) {
        console.error('Error creating event_artists:', eventArtistsError)
        return NextResponse.json(
          { error: 'Failed to associate artists with event' },
          { status: 500 }
        )
      }
    }

    // If there are styles, save them to event_styles table
    if (styles.length > 0) {
      // Convert styles to lowercase to match database constraint
      const normalizedStyles = styles.map(style => ({
        event_id: event.id,
        style: style.toLowerCase()
      }))

      console.log('Creating event styles:', normalizedStyles)

      // Try bulk insert first
      const { error: bulkError } = await supabase
        .from('event_styles')
        .insert(normalizedStyles)

      if (bulkError) {
        console.error('Bulk insert error:', bulkError)
        
        // If bulk insert fails, try one by one
        for (const style of styles) {
          const normalizedStyle = style.toLowerCase()
          console.log(`Attempting to insert style: ${normalizedStyle} for event: ${event.id}`)
          
          const { error: styleError } = await supabase
            .from('event_styles')
            .insert({
              event_id: event.id,
              style: normalizedStyle
            })

          if (styleError) {
            console.error(`Error inserting style ${normalizedStyle}:`, styleError)
            return NextResponse.json(
              { 
                error: `Failed to associate style ${style} with event: ${styleError.message || 'Unknown error'}`,
                details: styleError
              },
              { status: 500 }
            )
          }
        }
      }
    }

    // Fetch the complete event data including styles
    const { data: completeEvent, error: fetchError } = await supabase
      .from('events')
      .select(`
        *,
        event_styles (
          style
        )
      `)
      .eq('id', event.id)
      .single()

    if (fetchError) {
      console.error('Error fetching complete event:', fetchError)
      return NextResponse.json(event) // Return basic event if fetch fails
    }

    return NextResponse.json(completeEvent)
  } catch (error) {
    console.error('Error in POST /api/events:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
